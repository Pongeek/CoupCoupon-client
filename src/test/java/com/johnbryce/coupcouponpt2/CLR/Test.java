package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Controller.CompanyController;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.stereotype.Component;

@Order(1)
@Component
@RequiredArgsConstructor
public class Test implements CommandLineRunner {

    private final CouponRepository couponRepository;
    private final CompanyServiceImp companyService;
    private final CompanyController companyController;


    @Override
    public void run(String... args) throws Exception {

    }
}
