package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Repository.LoginDetailsRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.AdminServiceImp;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import com.johnbryce.coupcouponpt2.ServicesImp.LoginDTOServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Order(1)
@Component
@RequiredArgsConstructor
public class ProjectCLR implements CommandLineRunner {
    private final AdminServiceImp adminServiceImp;
    private final CompanyServiceImp companyService;
    private final LoginDetailsRepository loginDetailsRepository;
    private final LoginDTOServiceImp loginDTOServiceImp;



    @Override
    public void run(String... args) throws Exception {

        //------------------------------------Admin Login------------------------------------------
        System.out.println("------------------------------------Admin Login------------------------------------------");
        LoginDTO loginDTO = LoginDTO.builder()
                .email("admin@admin.com")
                .name("Max")
                .password("admin")
                .type(UserType.ADMIN)
                .build();
        loginDetailsRepository.save(loginDTO);

        Credentials credentials = new Credentials("admin@admin.com","admin");
        try{
            adminServiceImp.login(credentials);
            System.out.println("Admin was logged in");

        }catch(Exception e){
            System.out.println(e.getMessage());
        }


        //--------------------------------------addCompany-----------------------------------

        System.out.println("Adding 5 new companies...");
        for (int i = 1; i <= 5; i++) {

            Company company = Company.builder()
                    .name("Company" + i)
                    .email("Company" + i + "@gmail.com")
                    .password("Company" + i)
                    .build();

            try {
                adminServiceImp.addCompany(company);
                System.out.println(company.getName() + " Was added to the database.");

            } catch (Exception err) {
                System.out.println(err.getMessage());
            }
        }

        System.out.println("\n-----------------------addCustomer---------------------------\n");

        System.out.println("Adding 5 new customers...");
        for (int i = 1; i <= 5; i++) {
            Customer customer = Customer.builder()
                    .firstName("Customer" + i)
                    .lastName("Lastname" + i)
                    .email("Customer" + i + "@gmail.com")
                    .password("Customer" + i)
                    .build();

            try {
                adminServiceImp.addCustomer(customer);
                System.out.println(customer.getFirstName() + " Was added to the database.");
            } catch (Exception err) {
                System.out.println(err.getMessage());

            }
        }

        //------------------------------------Company Login------------------------------------------
        System.out.println("\n------------------------------------Company Login----------------------------------------");
        credentials = new Credentials("Company2@gmail.com","Company2");
        try{
            companyService.login(credentials);
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("Adding 6 new coupons...");

        Coupon coupon3 = Coupon.builder()
                .companyID(2)
                .category(Category.FOOD)
                .title("Coupon3")
                .description("Just a coupon3")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2025-04-01"))
                .amount(100)
                .price(50.99)
                .image("")
                .build();

        Coupon coupon4 = Coupon.builder()
                .companyID(2)
                .category(Category.SPA)
                .title("Coupon4")
                .description("Just a coupon4")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2025-03-01"))
                .amount(50)
                .price(20)
                .image("")
                .build();

        Coupon coupon5 = Coupon.builder()
                .companyID(2)
                .category(Category.RESTAURANT)
                .title("Coupon5")
                .description("Just a coupon5")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2025-02-15"))
                .amount(100)
                .price(99)
                .image("")
                .build();

        Coupon coupon6 = Coupon.builder()
                .companyID(2)
                .category(Category.VACATION)
                .title("Coupon6")
                .description("Just a coupon 6")
                .startDate(Date.valueOf("2024-03-01"))
                .endDate(Date.valueOf("2025-04-01"))
                .amount(999)
                .price(25)
                .image("")
                .build();

        Coupon coupon7 = Coupon.builder()
                .companyID(2)
                .category(Category.CONCERTS)
                .title("Coupon7")
                .description("Just a coupon 7")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2025-04-01"))
                .amount(100)
                .price(99)
                .image("")
                .build();

        Coupon coupon8 = Coupon.builder()
                .companyID(4)
                .category(Category.FOOD)
                .title("Coupon8")
                .description("Just a coupon8 different company")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2024-04-01"))
                .amount(999)
                .price(555)
                .image("")
                .build();

        try {
            companyService.addCoupon(coupon3);
            System.out.println(coupon3.getTitle() + " added successfully");

            companyService.addCoupon(coupon4);
            System.out.println(coupon4.getTitle() + " added successfully");

            companyService.addCoupon(coupon5);
            System.out.println(coupon5.getTitle() + " added successfully");

            companyService.addCoupon(coupon6);
            System.out.println(coupon6.getTitle() + " added successfully");

            companyService.addCoupon(coupon7);
            System.out.println(coupon7.getTitle() + " added successfully");

            companyService.addCoupon(coupon8);
            System.out.println(coupon8.getTitle() + " added successfully");


        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }




    }
}
