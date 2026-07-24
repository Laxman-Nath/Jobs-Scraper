package com.laxmannath.job_scraper_backend.services;

import com.laxmannath.job_scraper_backend.dtos.AuthSuccessResponse;
import com.laxmannath.job_scraper_backend.dtos.LoginRequest;
import com.laxmannath.job_scraper_backend.dtos.RefreshRequest;
import com.laxmannath.job_scraper_backend.dtos.RegisterRequest;
import com.laxmannath.job_scraper_backend.enums.Role;
import com.laxmannath.job_scraper_backend.exceptions.BadRequestException;
import com.laxmannath.job_scraper_backend.exceptions.UnauthorizedException;
import com.laxmannath.job_scraper_backend.models.RefreshToken;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import com.laxmannath.job_scraper_backend.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final EmailVerificationService emailVerificationService;
    public AuthSuccessResponse register( RegisterRequest request,HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setPreferredTitles(request.getPreferredTitles());
        user.setSkills(request.getSkills());
        user.setPreferredLocations(request.getPreferredLocations());
        user.setProfileComplete(request.getPreferredTitles() != null && !request.getPreferredTitles().isEmpty());
        user.setEmailVerified(false);

        userRepository.save(user);

        log.info("About to publish verification email for {}", user.getEmail());
         emailVerificationService.sendVerificationEmail(user);

        return buildAuthResponse(user, response);
    }

    public AuthSuccessResponse login(LoginRequest request,HttpServletResponse response) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return buildAuthResponse(user, response);
    }

    public void logout(String refreshTokenValue,HttpServletResponse response) {
        if (refreshTokenValue != null) {
            refreshTokenService.revoke(refreshTokenValue);
        }

        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // expires immediately, clears the cookie
        response.addCookie(cookie);
    }

    public AuthSuccessResponse refresh(String refreshTokenValue,HttpServletResponse response){
        if (refreshTokenValue == null) {
            throw new BadRequestException("No refresh token provided");
        }

        RefreshToken refreshToken = refreshTokenService.validateAndGet(refreshTokenValue);
        User user = refreshToken.getUser();

        String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthSuccessResponse(newAccessToken, user.getEmail(), user.getRole().name());

    }

    private AuthSuccessResponse buildAuthResponse(User user, HttpServletResponse response) {
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        Cookie cookie = new Cookie("refreshToken", refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set true in production (requires HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);

        return new AuthSuccessResponse(accessToken, user.getEmail(), user.getRole().name());
    }

}
