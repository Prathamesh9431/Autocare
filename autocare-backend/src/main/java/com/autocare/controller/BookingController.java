package com.autocare.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.autocare.entity.Booking;
import com.autocare.entity.User;
import com.autocare.repository.UserRepository;
import com.autocare.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(
            BookingService bookingService,
            UserRepository userRepository) {

        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    // ========================================
    // CREATE BOOKING
    // ========================================

    @PostMapping
    public Booking createBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Force booking to belong to logged-in user
        booking.setUserId(user.getId());

        return bookingService.createBooking(booking);
    }

    // ========================================
    // GET ALL BOOKINGS
    // ADMIN ONLY
    // ========================================

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    // ========================================
    // GET CURRENT USER BOOKINGS
    // ========================================

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(
            @PathVariable Long userId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Customer can only access their own bookings
        if (!user.getId().equals(userId)
                && !"ADMIN".equalsIgnoreCase(user.getRole())) {

            throw new RuntimeException(
                    "You are not allowed to access these bookings");
        }

        return bookingService.getBookingsByUser(userId);
    }

    // ========================================
    // GET BOOKING BY ID
    // ========================================

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        Booking booking =
                bookingService.getBookingById(id);

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Admin can access any booking
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return booking;
        }

        // Customer can access only their booking
        if (!user.getId().equals(booking.getUserId())) {
            throw new RuntimeException(
                    "You are not allowed to access this booking");
        }

        return booking;
    }

    // ========================================
    // COMPLETE BOOKING
    // ========================================

    @PutMapping("/{id}/complete")
    public Booking completeBooking(
            @PathVariable Long id,
            Authentication authentication) {

        Booking booking =
                bookingService.getBookingById(id);

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getId().equals(booking.getUserId())
                && !"ADMIN".equalsIgnoreCase(user.getRole())) {

            throw new RuntimeException(
                    "You are not allowed to modify this booking");
        }

        return bookingService.completeBooking(id);
    }

    // ========================================
    // CANCEL BOOKING
    // ========================================

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {

        Booking booking =
                bookingService.getBookingById(id);

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getId().equals(booking.getUserId())
                && !"ADMIN".equalsIgnoreCase(user.getRole())) {

            throw new RuntimeException(
                    "You are not allowed to modify this booking");
        }

        return bookingService.cancelBooking(id);
    }

    // ========================================
    // DELETE BOOKING
    // ADMIN ONLY
    // ========================================

    @DeleteMapping("/{id}")
    public void deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);
    }

    // ========================================
    // UPDATE BOOKING STATUS
    // ADMIN ONLY
    // ========================================

    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return bookingService.updateStatus(id, status);
    }
}