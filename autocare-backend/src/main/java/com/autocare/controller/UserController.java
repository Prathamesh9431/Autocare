package com.autocare.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autocare.dto.LoginRequest;
import com.autocare.dto.LoginResponse;
import com.autocare.entity.User;
import com.autocare.service.JwtService;
import com.autocare.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // ================================
    // REGISTER
    // ================================

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return userService.register(user);
    }

    // ================================
    // LOGIN
    // ================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest) {

        User user = userService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        String token = jwtService.generateToken(user);

        return new LoginResponse(user, token);
    }

    // ================================
    // GET USER BY ID
    // ================================

    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    // ================================
    // FORGOT PASSWORD
    // ================================

    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        String otp = userService.generateResetOtp(email);

        return otp;
    }

    // ================================
    // VERIFY OTP
    // ================================

    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        boolean valid = userService.verifyResetOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            throw new RuntimeException(
                    "Invalid or expired OTP"
            );
        }

        return "OTP verified successfully";
    }

    // ================================
    // RESET PASSWORD
    // ================================

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return "Password reset successfully";
    }

    // ==================================================
    // VERIFY OTP REQUEST
    // ==================================================

    public static class VerifyOtpRequest {

        private String email;
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    // ==================================================
    // RESET PASSWORD REQUEST
    // ==================================================

    public static class ResetPasswordRequest {

        private String email;
        private String otp;
        private String newPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}