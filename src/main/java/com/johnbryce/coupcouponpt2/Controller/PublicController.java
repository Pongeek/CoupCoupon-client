package com.johnbryce.coupcouponpt2.Controller;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final CouponRepository couponRepository;

    @GetMapping("/coupons")
    public ResponseEntity<?> getAllCoupons(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Double maxPrice,
            @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(couponRepository.searchCoupons(search, category, maxPrice, pageable));
    }
}
