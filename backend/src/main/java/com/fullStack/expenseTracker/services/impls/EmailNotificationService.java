package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.services.NotificationService;
import com.fullStack.expenseTracker.models.User;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmailNotificationService implements NotificationService {

    @Value("${app.mail.from}")
    private String fromMail;

    @Value("${app.sendgrid.api-key}")
    private String sendGridApiKey;

    @Override
    public void sendUserRegistrationVerificationEmail(User user) {
        String subject = "Please verify your registration";
        String content = "Dear " + user.getUsername() + ",<br><br>"
                + "<p>Thank you for joining us! We are glad to have you on board.</p><br>"
                + "<p>To complete the sign up process, enter the verification code in your device.</p><br>"
                + "<p>verification code: <strong>" + user.getVerificationCode() + "</strong></p><br>"
                + "<p><strong>Please note that the above verification code will be expired within 15 minutes.</strong></p>"
                + "<br>Thank you,<br>"
                + "MyWallet Team.";

        sendEmail(user.getEmail(), subject, content);
    }

    public void sendForgotPasswordVerificationEmail(User user) {
        String subject = "Forgot password - Please verify your Account";
        String content = "Dear " + user.getUsername() + ",<br><br>"
                + "<p>To change your password, enter the verification code in your device.</p><br>"
                + "<p>verification code: <strong>" + user.getVerificationCode() + "</strong></p><br>"
                + "<p><strong>Please note that the above verification code will be expired within 15 minutes.</strong></p>"
                + "<br>Thank you,<br>"
                + "MyWallet Team.";

        sendEmail(user.getEmail(), subject, content);
    }

    private void sendEmail(String toAddress, String subject, String htmlContent) {
        try {
            String jsonBody = "{"
                    + "\"personalizations\":[{\"to\":[{\"email\":\"" + toAddress + "\"}]}],"
                    + "\"from\":{\"email\":\"" + fromMail + "\",\"name\":\"MyWallet\"},"
                    + "\"subject\":\"" + subject + "\","
                    + "\"content\":[{\"type\":\"text/html\",\"value\":\"" + escapeJson(htmlContent) + "\"}]"
                    + "}";

            HttpResponse<String> response = Unirest.post("https://api.sendgrid.com/v3/mail/send")
                    .header("Authorization", "Bearer " + sendGridApiKey)
                    .header("Content-Type", "application/json")
                    .body(jsonBody)
                    .asString();

            if (response.getStatus() >= 200 && response.getStatus() < 300) {
                log.info("Email sent successfully to {}", toAddress);
            } else {
                log.error("SendGrid email failed with status {}: {}", response.getStatus(), response.getBody());
                throw new RuntimeException("Failed to send email via SendGrid: " + response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toAddress, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
