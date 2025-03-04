package com.johnbryce.coupcouponpt2.Controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.johnbryce.coupcouponpt2.Beans.Views;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("CoupCouponAPI/Public")
@RequiredArgsConstructor
@CrossOrigin()
public class PublicController {

    private final CouponRepository couponRepository;

    @GetMapping("/GetAllCoupons")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCoupons() {
        // Return all coupons without requiring authentication
        return new ResponseEntity<>(couponRepository.findAll(), HttpStatus.OK);
    }
} 