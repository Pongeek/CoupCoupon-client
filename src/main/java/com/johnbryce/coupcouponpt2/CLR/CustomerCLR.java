package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Credentials;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.CustomerServiceImp;
import com.johnbryce.coupcouponpt2.Utils.PrintUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

//@Order(3)
//@Component
@RequiredArgsConstructor
public class CustomerCLR implements CommandLineRunner {

    private final CustomerServiceImp customerService;
    private final CouponRepository couponRepository;

    @Override
    public void run(String... args) throws Exception {

        //   _____          _                              _______        _
        //  / ____|        | |                            |__   __|      | |
        // | |    _   _ ___| |_ ___  _ __ ___   ___ _ __     | | ___  ___| |_
        // | |   | | | / __| __/ _ \| '_ ` _ \ / _ \ '__|    | |/ _ \/ __| __|
        // | |___| |_| \__ \ || (_) | | | | | |  __/ |       | |  __/\__ \ |_
        //  \_____\__,_|___/\__\___/|_| |_| |_|\___|_|       |_|\___||___/\__|
        //

        PrintUtils.customerServiceTest();
        //------------------------------------CustomerSystem Test*** - Login---------------------------------------------
        System.out.println("\n---------------------------CustomerService Test*** - Login-----------------------------------");
        try {
            if (customerService.login(new Credentials("Customer7@gmail.com", "Customer7")) > 0) {
                System.out.println("\nCustomer Successfully logged in");
            }
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        //---------------------------------CustomerSystem Test*** - purchaseCoupon--------------------------------------
        System.out.println("\n--------------------*** CustomerService Test - purchaseCoupon ***-----------------------");

        System.out.println("*** Purchasing 2 coupons successfully ***");
        try {
            System.out.println("Purchasing 2 coupons for 'Customer7' that logged in.");
            customerService.purchaseCoupon(3);
            customerService.purchaseCoupon(7);
            System.out.println("Customer purchased coupons successfully");
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }


        System.out.println("\n*** Purchasing a purchased Coupon by Customer7 to test an exception ***");
        try {
            customerService.purchaseCoupon(3);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("\n*** Trying to purchase a Coupon which is out of stock to test an exception ***");
        try {
            System.out.println("Purchasing Coupon ID: " + couponRepository.findCouponById(6).getId());
            customerService.purchaseCoupon(6);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("\n*** Trying to purchase Coupon5 which is outdated to test an exception ***");
        try {
            customerService.purchaseCoupon(5);
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }

        //---------------------------------CustomerSystem Test*** - printCoupons-------------------------------------
        System.out.println("\n--------------------------CustomerService Test*** - printCoupons--------------------------\n");
        System.out.println("*** Printing customer's coupons ***");
        customerService.getCustomerCoupons().forEach(System.out::println);

        System.out.println("\n*** Printing customer's coupons by category ***");
        customerService.getCustomerCouponsByCategory(Category.FOOD).forEach(System.out::println);

        System.out.println("\n*** Printing customer's coupons by max price - 100 ***");
        customerService.getCustomerCouponsByMaxPrice(150).forEach(System.out::println);

        System.out.println("\n*** Printing customer's details ***");
        try {
            System.out.println(customerService.getCustomerDetails());
        } catch (CoupCouponSystemException e) {
            System.out.println(e.getMessage());
        }
    }
}
