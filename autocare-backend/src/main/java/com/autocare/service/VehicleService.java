package com.autocare.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autocare.entity.Vehicle;
import com.autocare.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // ========================================
    // ADD VEHICLE
    // ========================================

    public Vehicle addVehicle(Vehicle vehicle) {

        if (vehicle.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required."
            );
        }

        if (vehicleRepository
                .findByRegistration(vehicle.getRegistration())
                .isPresent()) {

            throw new RuntimeException(
                    "Vehicle with this registration number already exists."
            );
        }

        return vehicleRepository.save(vehicle);
    }

    // ========================================
    // GET VEHICLES FOR USER
    // ========================================

    public List<Vehicle> getVehiclesByUser(Long userId) {

        return vehicleRepository.findByUserId(userId);
    }

    // ========================================
    // GET VEHICLE BY ID
    // ========================================

    public Vehicle getVehicleById(Long id) {

        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));
    }

    // ========================================
    // UPDATE VEHICLE
    // ========================================

    public Vehicle updateVehicle(
            Long id,
            Vehicle updatedVehicle,
            Long userId) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));

        // Check ownership
        if (vehicle.getUserId() == null ||
                !vehicle.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to update this vehicle."
            );
        }

        // Check registration belongs to another vehicle
        vehicleRepository
                .findByRegistration(updatedVehicle.getRegistration())
                .ifPresent(existingVehicle -> {

                    if (!existingVehicle.getId().equals(id)) {
                        throw new RuntimeException(
                                "Vehicle with this registration number already exists."
                        );
                    }
                });

        vehicle.setType(updatedVehicle.getType());
        vehicle.setBrand(updatedVehicle.getBrand());
        vehicle.setModel(updatedVehicle.getModel());
        vehicle.setYear(updatedVehicle.getYear());
        vehicle.setFuel(updatedVehicle.getFuel());
        vehicle.setRegistration(updatedVehicle.getRegistration());
        vehicle.setMileage(updatedVehicle.getMileage());

        return vehicleRepository.save(vehicle);
    }

    // ========================================
    // DELETE VEHICLE
    // ========================================

    public void deleteVehicle(
            Long id,
            Long userId) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));

        // Check ownership
        if (vehicle.getUserId() == null ||
                !vehicle.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to delete this vehicle."
            );
        }

        vehicleRepository.delete(vehicle);
    }
}