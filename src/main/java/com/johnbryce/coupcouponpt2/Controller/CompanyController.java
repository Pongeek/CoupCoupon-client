package com.johnbryce.coupcouponpt2.Controller;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyServiceImp companyService;

    @PostMapping("/coupons")
    public ResponseEntity<?> addCoupon(@Valid @RequestBody Coupon coupon) throws CoupCouponSystemException {
        companyService.addCoupon(coupon);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Coupon created successfully"));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable int id, @Valid @RequestBody Coupon coupon)
            throws CoupCouponSystemException {
        companyService.updateCoupon(id, coupon);
        return ResponseEntity.ok(Map.of("message", "Coupon " + id + " updated"));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable int id) throws CoupCouponSystemException {
        companyService.deleteCoupon(id);
        return ResponseEntity.ok(Map.of("message", "Coupon " + id + " deleted"));
    }

    @GetMapping("/coupons")
    public ResponseEntity<?> getAllCompanyCoupons() {
        return ResponseEntity.ok(companyService.getAllCompanyCoupons());
    }

    @GetMapping("/coupons/category/{category}")
    public ResponseEntity<?> getAllCompanyCouponsByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(companyService.getCompanyCouponsByCategory(category));
    }

    @GetMapping("/coupons/max-price/{price}")
    public ResponseEntity<?> getCompanyCouponsByMaxPrice(@PathVariable double price) {
        return ResponseEntity.ok(companyService.getCompanyCouponsByPrice(price));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCompanyProfile() throws CoupCouponSystemException {
        return ResponseEntity.ok(companyService.getCompany());
    }
}
