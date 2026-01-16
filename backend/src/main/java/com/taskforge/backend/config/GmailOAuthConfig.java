package com.taskforge.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Data
@Component
@ConfigurationProperties(prefix = "mail.oauth")
public class GmailOAuthConfig {
    @Value("classpath:token.json")
    private Resource tokenPath;

    @PostConstruct
    public void validateTokenPath(){
        System.out.println("tokenPath: " + tokenPath);
        System.out.println("exists? " + (tokenPath != null && tokenPath.exists()));
        if(tokenPath == null || !tokenPath.exists()){
            throw new IllegalStateException("token.json not found or path is incorrect. Check mail.oauth.token.path in application.properties");
        }
    }


    public String getAccessToken() throws IOException{
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(tokenPath.getInputStream());

        String refreshToken = node.get("refresh_token").asText();
        String clientId = node.get("client_id").asText();
        String clientSecret = node.get("client_secret").asText();

        URL url = URI.create("https://oauth2.googleapis.com/token").toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String body = "client_id=" + clientId +
                    "&client_secret=" + clientSecret +
                    "&refresh_token=" + refreshToken +
                    "&grant_type=refresh_token";

        try (OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream())) {
            writer.write(body);
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new IOException("Failed to get access token, HTTP response code: " + responseCode);
        }

        JsonNode response = mapper.readTree(conn.getInputStream());
        if (response.get("access_token") == null) {
            throw new IOException("No access_token found in response: " + response.toString());
        }

        return response.get("access_token").asText();
    }
}
