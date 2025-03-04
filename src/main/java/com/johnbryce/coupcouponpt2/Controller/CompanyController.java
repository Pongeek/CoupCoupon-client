package com.johnbryce.coupcouponpt2.Controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Views;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;



import java.security.SignatureException;


@RestController
@RequestMapping("CoupCouponAPI/Company")
@RequiredArgsConstructor
@CrossOrigin()
public class CompanyController {

    private final CompanyServiceImp companyService;
    private final JWT jwtUtil;

    @PostMapping("/AddCoupon")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addCoupon(@RequestHeader("Authorization") String jwt, @Validated @RequestBody Coupon coupon
    ) throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        companyService.addCoupon(coupon);
        return new ResponseEntity<>("Company Created a new Coupon",getHeaders(jwt),HttpStatus.CREATED);
    }


    @PutMapping("/UpdateCoupon/{couponID}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateCoupon(@RequestHeader("Authorization") String jwt, @PathVariable int couponID
            , @Validated @RequestBody Coupon coupon) throws CoupCouponSystemException, SignatureException {

        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        companyService.updateCoupon(couponID, coupon);
        return new ResponseEntity<>("Company Updated Coupon " + couponID ,getHeaders(jwt),HttpStatus.OK);
    }

    @DeleteMapping("/DeleteCoupon/{couponID}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteCoupon(@RequestHeader("Authorization") String jwt,@PathVariable int couponID)
            throws CoupCouponSystemException, SignatureException {

        //NEED TO DO A METHOD TO CHECK IF EXPIRED.
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        companyService.deleteCoupon(couponID);
        return new ResponseEntity<>("Company Deleted Coupon " + couponID ,getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetAllCompanyCoupons")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCompanyCoupons(@RequestHeader("Authorization") String jwt)
            throws CoupCouponSystemException, SignatureException {

        //NEED TO DO A METHOD TO CHECK IF EXPIRED.
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(companyService.getAllCompanyCoupons(),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetCouponsByCategory/{category}")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getAllCompanyCouponsByCategory(@RequestHeader("Authorization") String jwt,@PathVariable Category category)
            throws CoupCouponSystemException, SignatureException {

        //NEED TO DO A METHOD TO CHECK IF EXPIRED.
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        return new ResponseEntity<>(companyService.getCompanyCouponsByCategory(category),getHeaders(jwt),HttpStatus.OK);

    }

    @GetMapping("/GetCouponsByMaxPrice/{price}")
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getCompanyCouponsByMaxPrice(@RequestHeader("Authorization") String jwt,@PathVariable Integer price)
            throws CoupCouponSystemException, SignatureException {

        //NEED TO DO A METHOD TO CHECK IF EXPIRED.
        String token = jwt.replace("Bearer ", "");

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }
        return new ResponseEntity<>(companyService.getCompanyCouponsByPrice(price),getHeaders(jwt),HttpStatus.OK);
    }

    @GetMapping("/GetCompany")
    @ResponseStatus(HttpStatus.OK)
    @JsonView(Views.Public.class)
    public ResponseEntity<?> getCompany(@RequestHeader( value = "Authorization",required = false) String jwt)
            throws CoupCouponSystemException, SignatureException {

        // Extracting the JWT token by removing "Bearer " prefix
        String token = jwt.replace("Bearer ", "");
        System.out.println(token);

        // Optionally, validate the token here or within the service
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is expired");
        }

        // Retrieve company info and return it in the response
        return new ResponseEntity<>(companyService.getCompany(),getHeaders(jwt),HttpStatus.OK);
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




