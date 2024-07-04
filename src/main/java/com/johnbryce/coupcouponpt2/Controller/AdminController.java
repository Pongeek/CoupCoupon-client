package com.johnbryce.coupcouponpt2.Controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Beans.Views;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.AdminServiceImp;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.SignatureException;

@RestController
@RequestMapping("CoupCouponAPI/Admin")
@RequiredArgsConstructor
@CrossOrigin()
public class AdminController {

    private final AdminServiceImp adminService;
    private final JWT jwtUtil;


    @PostMapping("/AddCompany")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addCompany(@RequestHeader("Authorization") String jwt,@Validated @RequestBody Company company)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.addCompany(company);

        return new ResponseEntity<>("Company added - " + company.getName(),getHeaders(jwt),HttpStatus.CREATED );
    }

    @PutMapping("/UpdateCompany/{companyID}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateCompany(@RequestHeader("Authorization") String jwt,@Validated @RequestBody Company company
            , @PathVariable int companyID) throws CoupCouponSystemException, SignatureException {


        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.updateCompany(companyID,company);
        return new ResponseEntity<>("Company updated - " + company.getName(),getHeaders(jwt),HttpStatus.OK);
    }

    @DeleteMapping("/DeleteCompany/{companyID}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> deleteCompany(@RequestHeader("Authorization") String jwt,@PathVariable int companyID)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.deleteCompany(companyID);
        return new ResponseEntity<>("Company - " + companyID + " was deleted",getHeaders(jwt),HttpStatus.ACCEPTED );
    }

    @GetMapping("/GetAllCompanies")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCompanies(@RequestHeader("Authorization") String jwt)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }


        return new ResponseEntity<>(adminService.getAllCompanies(),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetCompany/{companyID}")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getOneCompany(@RequestHeader("Authorization") String jwt,@PathVariable int companyID)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(adminService.getOneCompany(companyID),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("GetAllCoupons")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCoupons(@RequestHeader("Authorization") String jwt)
            throws CoupCouponSystemException, SignatureException {

        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }
        return new ResponseEntity<>(adminService.getAllCoupons(),getHeaders(jwt),HttpStatus.OK);
    }

    @PostMapping("/AddCustomer")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addCustomer(@RequestHeader("Authorization") String jwt,@Validated @RequestBody Customer customer)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.addCustomer(customer);
        return new ResponseEntity<>("Customer added - " + customer.getEmail(),getHeaders(jwt),HttpStatus.CREATED);
    }

    @PutMapping("/UpdateCustomer/{customerID}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> updateCustomer(@RequestHeader("Authorization") String jwt,@PathVariable int customerID
            ,@RequestBody Customer customer) throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.updateCustomer(customerID,customer);
        return new ResponseEntity<>("Customer " + customerID + " was updated",getHeaders(jwt),HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/DeleteCustomer/{customerID}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> deleteCustomer(@RequestHeader("Authorization") String jwt,@PathVariable int customerID)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        adminService.deleteCustomer(customerID);
        return new ResponseEntity<>("Customer " + customerID + " was deleted",getHeaders(jwt),HttpStatus.ACCEPTED);
    }

    @GetMapping("/GetAllCustomers")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCustomers(@RequestHeader("Authorization") String jwt)
            throws SignatureException, CoupCouponSystemException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(adminService.getAllCustomers(),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetCustomer/{customerID}")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getOneCustomer(@RequestHeader("Authorization") String jwt,@PathVariable int customerID)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(adminService.getOneCustomer(customerID),
                getHeaders(jwt),HttpStatus.OK);
    }

    @DeleteMapping("/DeleteCoupon/{couponID}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> deleteCoupon(@RequestHeader("Authorization") String jwt,@PathVariable int couponID)
        throws CoupCouponSystemException, SignatureException {

        String token = jwt.replace("Bearer ", "");

        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }
        adminService.deleteCoupon(couponID);
        return new ResponseEntity<>("Admin Deleted Coupon " + couponID,getHeaders(jwt),HttpStatus.ACCEPTED);
    }

    private HttpHeaders getHeaders(String jwt) throws SignatureException {
        HttpHeaders headers = new HttpHeaders();
        //JWT without the bearer
        String userJWT = jwt.split(" ")[1];
        if (jwtUtil.validateToken(userJWT)){
            headers.set("Authorization", "Bearer "+jwtUtil.generateToken(userJWT));
        }
        return headers;
    }
}
