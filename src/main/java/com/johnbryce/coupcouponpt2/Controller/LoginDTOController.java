package com.johnbryce.coupcouponpt2.Controller;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.LoginDTOServiceImp;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class LoginDTOController {

    private final LoginDTOServiceImp loginDTOServiceImp;
    private final JWT jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody Credentials credentials) throws CoupCouponSystemException {
        LoginDTO loginDTO = loginDTOServiceImp.login(credentials);

        String accessToken = jwtUtil.generateAccessToken(
                loginDTO.getId(), loginDTO.getEmail(), loginDTO.getName(), loginDTO.getType().name());
        String refreshToken = jwtUtil.generateRefreshToken(
                loginDTO.getId(), loginDTO.getEmail(), loginDTO.getType().name());

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "userType", loginDTO.getType().name(),
                "userId", loginDTO.getId(),
                "name", loginDTO.getName()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }

        int userId = jwtUtil.extractUserId(refreshToken);
        String email = jwtUtil.extractEmail(refreshToken);
        String userType = jwtUtil.extractUserType(refreshToken);

        String newAccessToken = jwtUtil.generateAccessToken(userId, email, email, userType);
        String newRefreshToken = jwtUtil.generateRefreshToken(userId, email, userType);

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> customerRegister(@Valid @RequestBody Customer customer) throws CoupCouponSystemException {
        loginDTOServiceImp.customerRegister(customer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registration successful for " + customer.getEmail()));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> isEmailExist(@PathVariable String email) {
        return ResponseEntity.ok(loginDTOServiceImp.isEmailExists(email));
    }
}
