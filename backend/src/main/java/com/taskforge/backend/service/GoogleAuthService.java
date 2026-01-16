package com.taskforge.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskforge.backend.exception.InvalidIdTokenException;
import com.taskforge.backend.exception.InvalidResponseException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class GoogleAuthService {
    @Value("${google.oauth.credentials.path}")
    private Resource CredentialsResource;

    private JsonNode webCredentials;

    @PostConstruct
    public void loadCredentials() throws Exception{
        ObjectMapper mapper = new ObjectMapper();
        try(InputStream is = CredentialsResource.getInputStream()){
            JsonNode credentialsJson = mapper.readTree(is);
            webCredentials = credentialsJson.get("web");
        }
    }

    public String getClientId(){
        return webCredentials.get("client_id").asText();
    }

    public String getClientSecret(){
        return webCredentials.get("client_secret").asText();
    }

    public String getRedirectUri(){
        return webCredentials.get("redirect_uris").get(0).asText();
    }

    public String buildAuthUrl(){
        return "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + getClientId() +
                "&redirect_uri=" + getRedirectUri() +
                "&response_type=code" +
                "&scope=openid%20email%20profile";
    }

    public Map<String,Object> exchangeCodeForTokens(String code){
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String,String> params = new LinkedMultiValueMap<>();
        params.add("code",code);
        params.add("client_id",getClientId());
        params.add("client_secret",getClientSecret());
        params.add("redirect_uri",getRedirectUri());
        params.add("grant_type","authorization_code");

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String,String>> request = new HttpEntity<>(params, httpHeaders);

        ResponseEntity<Map<String,Object>> response = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<Map<String,Object>>() {}
        );

        Map<String, Object> tokens = response.getBody();

        if(tokens == null){
            throw new InvalidResponseException("Empty response from Google token endpoint");
        }

        if(!tokens.containsKey("id_token")){
            throw new InvalidResponseException("Google token response missing id_token");
        }

        return tokens;
    }

    public Map<String,Object> parseIdToken(String idToken){
        JwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();

        if(idToken == null || idToken.isEmpty()){
            throw new InvalidIdTokenException("ID token was null or empty");
        }

        Jwt jwt = decoder.decode(idToken);

        Map<String,Object> allClaims = jwt.getClaims();

        Map<String,Object> claims = new LinkedHashMap<>();
        claims.put("sub", allClaims.get("sub"));
        claims.put("name", allClaims.get("name"));
        claims.put("email", allClaims.get("email"));
        claims.put("picture", allClaims.get("picture"));

        return claims;
    }

}
