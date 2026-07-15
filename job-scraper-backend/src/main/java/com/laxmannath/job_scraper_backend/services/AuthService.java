package com.laxmannath.job_scraper_backend.services;

import com.laxmannath.job_scraper_backend.dtos.AuthSuccessResponse;
import com.laxmannath.job_scraper_backend.dtos.LoginRequest;
import com.laxmannath.job_scraper_backend.dtos.RefreshRequest;
import com.laxmannath.job_scraper_backend.dtos.RegisterRequest;
import com.laxmannath.job_scraper_backend.enums.Role;
import com.laxmannath.job_scraper_backend.models.RefreshToken;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import com.laxmannath.job_scraper_backend.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    public AuthSuccessResponse register( RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthSuccessResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return buildAuthResponse(user);
    }

    public void logout(RefreshRequest request) {
        refreshTokenService.revoke(request.getRefreshToken());
    }

    public AuthSuccessResponse refresh(RefreshRequest refreshRequest){
        RefreshToken refreshToken = refreshTokenService.validateAndGet(refreshRequest.getRefreshToken());
        User user = refreshToken.getUser();

        String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthSuccessResponse(newAccessToken,refreshToken.getToken(), user.getEmail(), user.getRole().name());
    }

    private AuthSuccessResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return new AuthSuccessResponse(accessToken, refreshToken.getToken(), user.getEmail(), user.getRole().name());
    }

}
