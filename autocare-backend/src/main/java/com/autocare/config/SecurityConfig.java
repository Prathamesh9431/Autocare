package com.autocare.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "https://autocare-lky8-pearl.vercel.app",
            "https://*.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // ==========================================
            // CSRF
            // ==========================================

            .csrf(csrf -> csrf.disable())

            // ==========================================
            // CORS
            // ==========================================

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ==========================================
            // JWT = STATELESS
            // ==========================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // ==========================================
            // AUTHORIZATION
            // ==========================================

            .authorizeHttpRequests(auth -> auth

                // ------------------------------------------
                // PUBLIC APIs
                // ------------------------------------------

                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/users/forgot-password",
                    "/api/users/verify-otp",
                    "/api/users/reset-password",
                    "/api/auth/**"
                ).permitAll()


                // ------------------------------------------
                // CUSTOMER + ADMIN
                // VIEW OWN BOOKINGS
                // ------------------------------------------

                .requestMatchers(
                    "/api/bookings/user/**"
                ).hasAnyRole("CUSTOMER", "ADMIN")


                // ------------------------------------------
                // CUSTOMER + ADMIN
                // CREATE BOOKING
                // ------------------------------------------

                .requestMatchers(
                    "/api/bookings"
                ).hasAnyRole("CUSTOMER", "ADMIN")


                // ------------------------------------------
                // CUSTOMER + ADMIN
                // CANCEL THEIR OWN BOOKING
                // ------------------------------------------

                .requestMatchers(
                    "/api/bookings/*/cancel"
                ).hasAnyRole("CUSTOMER", "ADMIN")


                // ------------------------------------------
                // CUSTOMER + ADMIN
                // COMPLETE THEIR OWN BOOKING
                // ------------------------------------------

                .requestMatchers(
                    "/api/bookings/*/complete"
                ).hasAnyRole("CUSTOMER", "ADMIN")


                // ------------------------------------------
                // ADMIN ONLY
                // GET ALL BOOKINGS
                // DELETE BOOKING
                // UPDATE STATUS
                // ------------------------------------------

                .requestMatchers(
                    "/api/bookings/**"
                ).hasRole("ADMIN")


                // ------------------------------------------
                // EVERYTHING ELSE
                // ------------------------------------------

                .anyRequest().permitAll()
            )

            // ==========================================
            // JWT FILTER
            // ==========================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}