package com.autocare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autocare.entity.ServiceBooking;

public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {

}