package com.autocare.controller;

import java.util.List;

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

import com.autocare.entity.Vehicle;
import com.autocare.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // ========================================
    // ADD VEHICLE
    // ========================================

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {

        return vehicleService.addVehicle(vehicle);
    }

    // ========================================
    // GET VEHICLES FOR USER
    // ========================================

    @GetMapping("/user/{userId}")
    public List<Vehicle> getVehiclesByUser(
            @PathVariable Long userId) {

        return vehicleService.getVehiclesByUser(userId);
    }

    // ========================================
    // UPDATE VEHICLE
    // ========================================

    @PutMapping("/{id}")
    public Vehicle updateVehicle(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Vehicle vehicle) {

        return vehicleService.updateVehicle(
                id,
                vehicle,
                userId
        );
    }

    // ========================================
    // DELETE VEHICLE
    // ========================================

    @DeleteMapping("/{id}")
    public void deleteVehicle(
            @PathVariable Long id,
            @RequestParam Long userId) {

        vehicleService.deleteVehicle(id, userId);
    }
}