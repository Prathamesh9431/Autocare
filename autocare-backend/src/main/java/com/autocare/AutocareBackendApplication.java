package com.autocare;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.autocare.repository.UserRepository;

@SpringBootApplication
public class AutocareBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutocareBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner makeAdmin(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("prathameshghatte56@gmail.com").ifPresent(user -> {
                if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                    user.setRole("ADMIN");
                    userRepository.save(user);
                    System.out.println(">>> Successfully promoted prathameshghatte56@gmail.com to ADMIN!");
                }
            });
        };
    }
}