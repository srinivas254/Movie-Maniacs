package com.taskforge.backend.service;

import com.taskforge.backend.config.GmailOAuthConfig;
import com.taskforge.backend.exception.EmailSendException;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.eclipse.angus.mail.smtp.SMTPTransport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class MailService {
    private final GmailOAuthConfig gmailOAuthConfig;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${mail.sender.email}")
    private String senderEmail;

    @Autowired
    public MailService(GmailOAuthConfig gmailOAuthConfig){
        this.gmailOAuthConfig = gmailOAuthConfig;
    }

    public void sendMail(String to, String subject,String body){
        try {
            String accessToken = gmailOAuthConfig.getAccessToken();

            Properties props = new Properties();
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", String.valueOf(port));
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.auth.mechanisms", "XOAUTH2");
            props.put("mail.smtp.starttls.enable", "true");

            Session session = Session.getInstance(props);

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");

            try (SMTPTransport transport = (SMTPTransport) session.getTransport("smtp")) {
                transport.connect(host, senderEmail, accessToken);
                transport.sendMessage(message, message.getAllRecipients());
                System.out.println("✅ Mail sent successfully to " + to);
            }
        }catch(Exception e){
            throw new EmailSendException("Unable to send otp email",e);
        }
    }
}
