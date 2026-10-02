package com.autocare.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autocare.entity.ServiceBooking;
import com.autocare.repository.ServiceBookingRepository;

@Service
public class ServiceBookingService {

    private final ServiceBookingRepository bookingRepository;

    public ServiceBookingService(ServiceBookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public ServiceBooking bookService(ServiceBooking booking) {
        return bookingRepository.save(booking);
    }

    public List<ServiceBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}