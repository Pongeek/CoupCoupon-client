package com.johnbryce.coupcouponpt2.Controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.AdminServiceImp;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import com.johnbryce.coupcouponpt2.ServicesImp.CustomerServiceImp;
import com.johnbryce.coupcouponpt2.ServicesImp.LoginDTOServiceImp;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.SignatureException;


@RestController
@RequestMapping("CoupCouponAPI/Login")
@RequiredArgsConstructor
@CrossOrigin()
public class LoginDTOController {
    private final LoginDTOServiceImp loginDTOServiceImp;
    private final CompanyServiceImp companyServiceImp;
    private final CustomerServiceImp customerServiceImp;
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final JWT jwtUtil;
    private final AdminServiceImp adminServiceImp;


    @PostMapping("/Login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> login(@RequestBody Credentials credentials, HttpSession session) throws Exception{

        LoginDTO loginDTO = loginDTOServiceImp.login(credentials);
        HttpHeaders headers = new HttpHeaders();


        if(loginDTO.getType() == UserType.ADMIN) {

            adminServiceImp.login(credentials);
            String token = jwtUtil.generateToken(loginDTO);
            headers.set("Authorization", "Bearer " + token);
            System.out.println("FULL ADMIN TOKEN: " + headers.getFirst("Authorization"));

            session.setAttribute("adminID", loginDTO.getId());
            return new ResponseEntity<>("Admin: " + session.getAttribute("adminID")
                    + " Logged in successfully.",headers, HttpStatus.ACCEPTED);
        }

        if(loginDTO.getType() == UserType.COMPANY){

            Company company = companyRepository.findCompanyById(companyServiceImp.login(credentials));

            String token = jwtUtil.generateToken(company,loginDTO);
            headers.set("Authorization", "Bearer " + token);
            System.out.println("FULL TOKEN: " + headers.getFirst("Authorization"));

            session.setAttribute("companyID", company.getId());
            return new ResponseEntity<>("Company ID: " + session.getAttribute("companyID")
                    + " Logged in successfully.", headers, HttpStatus.ACCEPTED);

        }

        if(loginDTO.getType() == UserType.CUSTOMER){
            Customer customer = customerRepository.findCustomerById(customerServiceImp.login(credentials));

            String token = jwtUtil.generateToken(customer,loginDTO);
            headers.set("Authorization", "Bearer " + token);
            System.out.println("FULL TOKEN: " + headers.getFirst("Authorization"));

            session.setAttribute("customerID", customer.getId());

            return new ResponseEntity<>("Customer ID: " + session.getAttribute("customerID") +
                    " Logged in successfully.", headers, HttpStatus.ACCEPTED);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log in failed, incorrect password or email");
    }

    @PostMapping("/CustomerRegister")
    @JsonView(Views.Public.class)
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> customerRegister(@RequestBody Customer customer) throws Exception {
        loginDTOServiceImp.customerRegister(customer);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("New customer " + customer.getEmail() + " has signed up.");

    }

    @GetMapping("/IsEmailExist/{email}")
    @JsonView(Views.Public.class)
    @ResponseStatus(HttpStatus.OK)
    public boolean isEmailExist(@PathVariable String email){
        return loginDTOServiceImp.isEmailExists(email);
    }

}
