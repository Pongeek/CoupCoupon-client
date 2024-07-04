package com.johnbryce.coupcouponpt2.Controller;


import com.fasterxml.jackson.annotation.JsonView;
import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Views;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.CustomerServiceImp;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SignatureException;


@RestController
@RequestMapping("CoupCouponAPI/Customer")
@RequiredArgsConstructor
@CrossOrigin()
public class CustomerController {

    private final CustomerServiceImp customerService;
    private final JWT jwtUtil;

//    @PostMapping("/CustomerLogin")
//    @ResponseStatus(HttpStatus.OK)
//    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password, HttpSession session)
//            throws CoupCouponSystemException {
//
//        boolean isLoggedIn = customerService.login(email, password);
//        if (isLoggedIn) {
//            session.setAttribute("customerID",customerService.getCustomerDetails().getId());
//            return ResponseEntity.ok("Customer ID: " + session.getAttribute("customerID") + ", Logged in successfully.");
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log in failed, incorrect password or email");
//    }

    @PostMapping("/PurchaseCoupon/{couponID}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<String> purchaseCoupon(@RequestHeader("Authorization") String jwt, @PathVariable int couponID)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }


        customerService.purchaseCoupon(couponID);
        return new ResponseEntity<>("Customer purchased  a coupon - " + couponID + " successfully"
                ,getHeaders(jwt),HttpStatus.ACCEPTED);
    }

    @GetMapping("/GetCustomerCoupons")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getCustomerCoupons(@RequestHeader("Authorization") String jwt) throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(customerService.getCustomerCoupons(),getHeaders(jwt),HttpStatus.OK);

    }

    @GetMapping("/GetCustomerCouponsByCategory/{category}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getCustomerCouponsByCategory(@RequestHeader("Authorization") String jwt
            ,@PathVariable Category category) throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(customerService.getCustomerCouponsByCategory(category),getHeaders(jwt),HttpStatus.OK);

    }


    @GetMapping("/GetCustomerCouponsByMaxPrice/{price}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getCustomerCouponsByMaxPrice(@RequestHeader("Authorization") String jwt,@PathVariable int price)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(customerService.getCustomerCouponsByMaxPrice(price),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetCustomerDetails")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getCustomerDetails(@RequestHeader("Authorization") String jwt,@RequestHeader("Authorization") String myJWT)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(customerService.getCustomerDetails(),getHeaders(myJWT),HttpStatus.OK);
    }

    @GetMapping("/getAllAvailableCoupons")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllAvailableCoupons(@RequestHeader("Authorization") String jwt)
            throws CoupCouponSystemException, SignatureException {
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }
        return new ResponseEntity<>(customerService.getAllCoupons(),getHeaders(jwt),HttpStatus.OK);
    }


    private HttpHeaders getHeaders(String jwt) throws SignatureException {
        HttpHeaders headers = new HttpHeaders();
        String userJWT = jwt.split(" ")[1];
        if (jwtUtil.validateToken(userJWT)){
            String token = jwtUtil.generateToken(userJWT);
            headers.set("Authorization", "Bearer " + token);
        }
        return headers;
    }

}
