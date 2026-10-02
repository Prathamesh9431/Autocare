package com.autocare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    // ================================
    // PASSWORD
    // ================================

   @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;

    // ================================
    // FORGOT PASSWORD
    // ================================
    @JsonIgnore
    private String resetOtp;

    @JsonIgnore
    private Long resetOtpExpiry;

    public User() {
    }

    // ================================
    // ROLE
    // ================================

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ================================
    // ID
    // ================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // ================================
    // NAME
    // ================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ================================
    // EMAIL
    // ================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ================================
    // PHONE
    // ================================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // ================================
    // PASSWORD
    // ================================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ================================
    // RESET OTP
    // ================================

    public String getResetOtp() {
        return resetOtp;
    }

    public void setResetOtp(String resetOtp) {
        this.resetOtp = resetOtp;
    }

    // ================================
    // OTP EXPIRY
    // ================================

    public Long getResetOtpExpiry() {
        return resetOtpExpiry;
    }

    public void setResetOtpExpiry(Long resetOtpExpiry) {
        this.resetOtpExpiry = resetOtpExpiry;
    }
}