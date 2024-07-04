package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Credentials;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.CompanyServiceImp;
import com.johnbryce.coupcouponpt2.Utils.PrintUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


import java.sql.Date;

//@Order(2)
//@Component
@RequiredArgsConstructor
public class CompanyCLR implements CommandLineRunner {
    private final CouponRepository couponRepository;
    private final CompanyServiceImp companyService;

    @Override
    public void run(String... args) throws Exception {

    //  ____                                          _____         _
    // / ___|___  _ __ ___  _ __   __ _ _ __  _   _  |_   _|__  ___| |_
    //| |   / _ \| '_ ` _ \| '_ \ / _` | '_ \| | | |   | |/ _ \/ __| __|
    //| |__| (_) | | | | | | |_) | (_| | | | | |_| |   | |  __/\__ \ |_
    // \____\___/|_| |_| |_| .__/ \__,_|_| |_|\__, |   |_|\___||___/\__|
    //                     |_|                |___/

        PrintUtils.companyRestTests();

        //------------------------------------CompanySystem Test*** - Login---------------------------------------------
        System.out.println("--------------------------*** CompanySystem Test - Login ***------------------------------");

        //Need to do it after I will make loginManager
        try {
            if (companyService.login(new Credentials("Company2@gmail.com", "Company2")) > 0) {
                System.out.println("Company logged in successfully");
            }
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }


        //------------------------------------CompanySystem Test*** - addCoupon-----------------------------------------
        System.out.println("\n--------------------------*** CompanyService Test - addCoupon ***-------------------------------");
        System.out.println("\n*** Creating and adding 6 coupons.... ***");

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
                .description("Expired Coupon4")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2024-03-01"))
                .amount(50)
                .price(20)
                .image("")
                .build();

        Coupon coupon5 = Coupon.builder()
                .companyID(2)
                .category(Category.RESTAURANT)
                .title("Coupon5")
                .description("Expired Coupon5")
                .startDate(Date.valueOf("2024-02-10"))
                .endDate(Date.valueOf("2024-02-15"))
                .amount(100)
                .price(99)
                .image("")
                .build();

        Coupon coupon6 = Coupon.builder()
                .companyID(2)
                .category(Category.VACATION)
                .title("Coupon6")
                .description("coupon with amount of 1 coupon Coupon5")
                .startDate(Date.valueOf("2024-03-01"))
                .endDate(Date.valueOf("2025-04-01"))
                .amount(1)
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

        System.out.println("\n*** Adding a false coupon with the same title per company to test an exception ***");
        Coupon testCouponException = Coupon.builder()
                .companyID(2)
                .category(Category.CONCERTS)
                .title("Coupon3")
                .description("A coupon with a same title ")
                .startDate(Date.valueOf("2024-03-10"))
                .endDate(Date.valueOf("2024-04-15"))
                .amount(540)
                .price(120)
                .image("")
                .build();

        try {
            companyService.addCoupon(testCouponException);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        //-----------------------------------CompanySystem Test*** - updateCoupon---------------------------------------
        System.out.println("\n-----------------------*** CompanyService Test - updateCoupon ***------------------------");
        System.out.println("\n*** updating a coupon title which the company already has in database to test exception ***");

        try {
            Coupon couponToUpdate = couponRepository.findCouponById(7);
            System.out.println("We will try to change '" + couponToUpdate.getTitle() + "' to 'Coupon3' which Company2 " +
                    "already has a coupon with the same name in database to test exception ***");

            couponToUpdate.setTitle("Coupon3");
            couponToUpdate.setDescription("Checking");

            companyService.updateCoupon(couponToUpdate.getId(), couponToUpdate);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("\n*** Updating a coupon successfully ***");

        try {
            Coupon couponToUpdate = couponRepository.findCouponById(7);
            System.out.println("We will try to change " + couponToUpdate.getTitle() + " to Coupon99 which does not" +
                    " exist in the database");

            couponToUpdate.setTitle("Coupon99");
            couponToUpdate.setAmount(998);
            couponToUpdate.setDescription("Coupon updated :D");

            companyService.updateCoupon(couponToUpdate.getId(), couponToUpdate);
            System.out.println("Coupon ID: " + couponToUpdate.getId() + " Coupon updated to '" + couponToUpdate.getTitle() + "' successfully.");
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        //-----------------------------------CompanySystem Test*** - deleteCoupon---------------------------------------
        System.out.println("\n-----------------------*** CompanyService Test - deleteCoupon ***-------------------------");
        System.out.println("*** Deleting a coupon to a different company to throw an exception ***");

        try {
            companyService.deleteCoupon(1);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("\n*** Deleting couponID - 4 successfully ***");
        try {
            companyService.deleteCoupon(4);
            System.out.println("Coupon deleted :)");
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        //-----------------------------------CompanySystem Test*** - printCoupons---------------------------------------
        System.out.println("\n-----------------------*** CompanyService Test - printCoupons ***------------------------");
        System.out.println("\n*** Printing coupons by company that logged in ***");
        companyService.getAllCompanyCoupons().forEach(System.out::println);

        System.out.println("\n*** Printing coupons by category: ***");
        companyService.getCompanyCouponsByCategory(Category.FOOD).forEach(System.out::println);

        System.out.println("\n*** Printing coupons by max price: ***");
        companyService.getCompanyCouponsByPrice(51).forEach(System.out::println);

//        System.out.println("\n*** Printing company Details: ***");
//        System.out.println(companyService.getCompany());

    }

}
