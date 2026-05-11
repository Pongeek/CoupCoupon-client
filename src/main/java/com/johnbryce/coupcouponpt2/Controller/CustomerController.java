package com.johnbryce.coupcouponpt2.Controller;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.CustomerServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerServiceImp customerService;

    @PostMapping("/coupons/{id}/purchase")
    public ResponseEntity<?> purchaseCoupon(@PathVariable int id) throws CoupCouponSystemException {
        customerService.purchaseCoupon(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("message", "Coupon " + id + " purchased successfully"));
    }

    @GetMapping("/coupons")
    public ResponseEntity<?> getCustomerCoupons() {
        return ResponseEntity.ok(customerService.getCustomerCoupons());
    }

    @GetMapping("/coupons/category/{category}")
    public ResponseEntity<?> getCustomerCouponsByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(customerService.getCustomerCouponsByCategory(category));
    }

    @GetMapping("/coupons/max-price/{price}")
    public ResponseEntity<?> getCustomerCouponsByMaxPrice(@PathVariable double price) {
        return ResponseEntity.ok(customerService.getCustomerCouponsByMaxPrice(price));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCustomerDetails() throws CoupCouponSystemException {
        return ResponseEntity.ok(customerService.getCustomerDetails());
    }

    @GetMapping("/available-coupons")
    public ResponseEntity<?> getAllAvailableCoupons() {
        return ResponseEntity.ok(customerService.getAllCoupons());
    }
}
