package com.johnbryce.coupcouponpt2.Controller;

import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.AdminServiceImp;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminServiceImp adminService;

    @PostMapping("/companies")
    public ResponseEntity<?> addCompany(@Valid @RequestBody Company company) throws CoupCouponSystemException {
        adminService.addCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Company added: " + company.getName()));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable int id, @Valid @RequestBody Company company)
            throws CoupCouponSystemException {
        adminService.updateCompany(id, company);
        return ResponseEntity.ok(Map.of("message", "Company updated: " + company.getName()));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable int id) throws CoupCouponSystemException {
        adminService.deleteCompany(id);
        return ResponseEntity.ok(Map.of("message", "Company " + id + " deleted"));
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllCompanies(pageable));
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<?> getOneCompany(@PathVariable int id) throws CoupCouponSystemException {
        return ResponseEntity.ok(adminService.getOneCompany(id));
    }

    @GetMapping("/coupons")
    public ResponseEntity<?> getAllCoupons() {
        return ResponseEntity.ok(adminService.getAllCoupons());
    }

    @PostMapping("/customers")
    public ResponseEntity<?> addCustomer(@Valid @RequestBody Customer customer) throws CoupCouponSystemException {
        adminService.addCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Customer added: " + customer.getEmail()));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @Valid @RequestBody Customer customer)
            throws CoupCouponSystemException {
        adminService.updateCustomer(id, customer);
        return ResponseEntity.ok(Map.of("message", "Customer " + id + " updated"));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable int id) throws CoupCouponSystemException {
        adminService.deleteCustomer(id);
        return ResponseEntity.ok(Map.of("message", "Customer " + id + " deleted"));
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllCustomers(pageable));
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getOneCustomer(@PathVariable int id) throws CoupCouponSystemException {
        return ResponseEntity.ok(adminService.getOneCustomer(id));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable int id) throws CoupCouponSystemException {
        adminService.deleteCoupon(id);
        return ResponseEntity.ok(Map.of("message", "Coupon " + id + " deleted"));
    }
}
