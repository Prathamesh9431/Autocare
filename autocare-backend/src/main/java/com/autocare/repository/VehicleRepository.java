package com.autocare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autocare.entity.Vehicle;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByRegistration(
            String registration
    );

    List<Vehicle> findByUserId(
            Long userId
    );
}