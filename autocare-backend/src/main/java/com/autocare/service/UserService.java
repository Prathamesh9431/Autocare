package com.autocare.service;

import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.autocare.entity.User;
import com.autocare.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================================
    // REGISTER
    // ================================

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // New users are customers by default
        user.setRole("CUSTOMER");

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // ================================
    // GET USER BY ID
    // ================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // ================================
    // LOGIN
    // ================================

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }

    // ================================
    // GENERATE OTP
    // ================================

    public String generateResetOtp(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "No account found with this email"
                    ));

    String otp = String.format(
            "%06d",
            new Random().nextInt(1000000)
    );

    long expiry =
            System.currentTimeMillis()
            + (5 * 60 * 1000);

    user.setResetOtp(otp);
    user.setResetOtpExpiry(expiry);

    userRepository.save(user);

    System.out.println("PASSWORD RESET OTP: " + otp);

    return otp;
}

    // ================================
    // VERIFY OTP
    // ================================

    public boolean verifyResetOtp(
            String email,
            String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        // Check OTP
        if (user.getResetOtp() == null ||
                !user.getResetOtp().equals(otp)) {

            return false;
        }

        // Check expiry
        if (user.getResetOtpExpiry() == null ||
                System.currentTimeMillis()
                > user.getResetOtpExpiry()) {

            return false;
        }

        return true;
    }

    // ================================
    // RESET PASSWORD
    // ================================

    public void resetPassword(
            String email,
            String otp,
            String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        // Verify OTP again
        if (user.getResetOtp() == null ||
                !user.getResetOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        // Check expiry
        if (user.getResetOtpExpiry() == null ||
                System.currentTimeMillis()
                > user.getResetOtpExpiry()) {

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        // Encrypt new password
        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        // Clear OTP after successful reset
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);
    }
}