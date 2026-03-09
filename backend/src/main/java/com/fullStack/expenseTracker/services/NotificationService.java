package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.models.User;
import org.springframework.stereotype.Service;

@Service
public interface NotificationService {

    void sendUserRegistrationVerificationEmail(User user);

    void sendForgotPasswordVerificationEmail(User user);

}
