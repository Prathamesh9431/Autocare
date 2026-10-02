package com.autocare.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.autocare.entity.Booking;
import com.autocare.entity.User;
import com.autocare.repository.BookingRepository;
import com.autocare.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // ================================
    // CREATE BOOKING
    // ================================

    public Booking createBooking(Booking booking) {

        booking.setStatus("Pending");

        booking.setBookingReference(
                "AC-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        return bookingRepository.save(booking);
    }

    // ================================
    // GET ALL BOOKINGS
    // Used by ADMIN
    // ================================

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ================================
    // GET BOOKINGS BY USER
    // Used by CUSTOMER
    // ================================

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // ================================
    // GET BOOKING BY ID
    // ================================

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    // ================================
    // MARK COMPLETED
    // ================================

    public Booking completeBooking(Long id) {

        Booking booking = getBookingById(id);

        booking.setStatus("Completed");

        return bookingRepository.save(booking);
    }

    // ================================
    // CANCEL BOOKING
    // ================================

    public Booking cancelBooking(Long id) {

        Booking booking = getBookingById(id);

        booking.setStatus("Cancelled");

        return bookingRepository.save(booking);
    }

    // ================================
    // DELETE BOOKING
    // ================================

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // ================================
    // UPDATE STATUS
    // Used by ADMIN
    // ================================

    public Booking updateStatus(Long id, String status) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Update booking status
        booking.setStatus(status);

        // Save updated booking
        Booking savedBooking =
                bookingRepository.save(booking);

        // Get customer who created this booking
        User user = userRepository.findById(
                booking.getUserId()
        ).orElseThrow(() ->
                new RuntimeException("Customer not found"));

        // Temporary testing
        System.out.println(
                "Customer email: " + user.getEmail()
        );

        System.out.println(
                "Customer name: " + user.getName()
        );

        return savedBooking;
    }
}