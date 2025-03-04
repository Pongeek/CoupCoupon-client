package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Controller.AdminController;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.ServicesImp.AdminServiceImp;
import com.johnbryce.coupcouponpt2.Utils.PrintUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

//@Component
//@Order(1)
@RequiredArgsConstructor
public class AdminCLR implements CommandLineRunner {

    private final AdminServiceImp adminServiceImp;
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepository couponRepository;


//	     ___      _           _        ______          _     _____         _
//	    / _ \    | |         (_)       | ___ \        | |   |_   _|       | |
//	   / /_\ \ __| |_ __ ___  _ _ __   | |_/ /___  ___| |_    | | ___  ___| |_ ___
//	   |  _  |/ _` | '_ ` _ \| | '_ \  |    // _ \/ __| __|   | |/ _ \/ __| __/ __|
//	   | | | | (_| | | | | | | | | | | | |\ \  __/\__ \ |_    | |  __/\__ \ |_\__ \
//	   \_| |_/\__,_|_| |_| |_|_|_| |_| \_| \_\___||___/\__|   \_/\___||___/\__|___/


    @Override
    public void run(String... args) throws Exception {

        PrintUtils.adminRestTests();
        //------------------------------------ AdminController Test*** - Login---------------------------------------------

        //Need to do it after I will make loginManager


        //-------------------------------------*** AdminController Test*** - addCompany-----------------------------------

        System.out.println("------------------------------*** AdminController addCompany *** --------------------------------\n");
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


        System.out.println("\n*** Adding a new company with existing email to check an exception ***");
        try {
            Company existedCompanyByEmail = Company.builder()
                    .name("Company99")
                    .email("Company1@gmail.com")
                    .password("Company99Pass")
                    .build();

            adminServiceImp.addCompany(existedCompanyByEmail);
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }


        System.out.println("\n*** Adding a new company with existing name to check an exception ***");
        try {
            Company existedCompanyByName = Company.builder()
                    .name("Company1")
                    .email("Company98@gmail.com")
                    .password("Company1")
                    .build();

            adminServiceImp.addCompany(existedCompanyByName);

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }


        //-------------------------------------*** AdminController Test*** - updateCompany-----------------------------------

        System.out.println("\n-----------------------*** adminController Test  - updateCompany ***---------------------------\n");

        System.out.println("*** Updating company's name to check an exception ***");

        try {
            Company companyToUpdate = companyRepository.findCompanyById(1);
            System.out.println("Setting name for "  + companyToUpdate.getName() + " to: Company2.");
            companyToUpdate.setName("Company2");
            adminServiceImp.updateCompany(companyToUpdate.getId(),companyToUpdate);
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\n*** Updating a company to an existing *email* in the database ***");
        try {
            Company companyToUpdate = companyRepository.findCompanyById(1);
            System.out.println("Setting email to: Company2@gmail.com which exists in the database to test exception.");
            companyToUpdate.setEmail("Company2@gmail.com");
            adminServiceImp.updateCompany(companyToUpdate.getId(),companyToUpdate);
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\n*** Updating a company successfully ***");

        try {
            Company companyToUpdate = companyRepository.findCompanyById(1);
            System.out.println("Company Before update:");
            System.out.println(companyToUpdate);

            System.out.println("\nSetting email to: Company9@gmail.com which not exists in the database" +
                    " and password.");

            companyToUpdate.setEmail("Company9@gmail.com");
            companyToUpdate.setPassword("Company9");
            adminServiceImp.updateCompany(companyToUpdate.getId(),companyToUpdate);

            System.out.println("Company After update:");
            System.out.println(companyToUpdate);

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        //-------------------------------------***adminController Test*** - deleteCompany-----------------------------------
        System.out.println("\n----------------------*** adminController Test - deleteCompany ***------------------------------");

        System.out.println("Deleting company which does not exist in the database to test exception.");
        try {
            adminServiceImp.deleteCompany(10);

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\nDeleting company ID: 3");
        try {
            adminServiceImp.deleteCompany(3);
            System.out.println("Company ID : 3 was deleted.");

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        //-------------------------------------*** adminController Test *** - printCompany-----------------------------------

        System.out.println("\n--------------------------*** adminController Test - printCompany ***----------------------------");

        System.out.println("\nPrinting all Companies:");
        adminServiceImp.getAllCompanies().forEach(System.out::println);

        System.out.println("\nPrinting a company that does not exist in the database to test an exception");
        try {
            System.out.println(adminServiceImp.getOneCompany(10));

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\nPrinting company which exists in the database:");
        try {
            System.out.println(adminServiceImp.getOneCompany(2));

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        //-------------------------------------*** adminController Test*** - addCustomer-----------------------------------
        System.out.println("\n-----------------------*** adminController Test *** - addCustomer---------------------------\n");

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

        System.out.println("\n*** Adding a new customer with an existing email in the database to test an exception ***");
        try {
            Customer existingCustomer = Customer.builder()
                    .firstName("Customer5")
                    .lastName("Lastname5")
                    .email("Customer5@gmail.com")
                    .password("Customer5")
                    .build();

            System.out.println("Built a new customer with a used email (Customer5@gmail.com) that already exists in the database.");
            adminServiceImp.addCustomer(existingCustomer);

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }


        //-------------------------------------*** AdminController Test*** - updateCustomer-----------------------------------

        System.out.println("\n---------------------*** AdminController Test - updateCustomer ***-------------------------");
        System.out.println("\n*** Updating a customer with an existing email in the database ***");

        try {
            Customer customerToUpdate = customerRepository.findCustomerById(1);
            System.out.println("Setting email to: Customer3@gmail.com which exists in the database.");
            customerToUpdate.setEmail("Customer3@gmail.com");
            adminServiceImp.updateCustomer(customerToUpdate.getId(),customerToUpdate);

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\n***Updating a customer successfully***");
        try {
            Customer customerToUpdate = customerRepository.findCustomerById(1);
            customerToUpdate.setEmail("Customer22@gmail.com");
            adminServiceImp.updateCustomer(customerToUpdate.getId(),customerToUpdate);
            System.out.println(customerToUpdate.getFirstName() + " email was updated to " + customerToUpdate.getEmail()
                    + " successfully");

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        //-------------------------------------*** AdminController Test *** - deleteCustomer-----------------------------------
        System.out.println("\n---------------------*** AdminController Test - deleteCustomer ***-------------------------");

        System.out.println("*** Building a new customer with coupons ***");

        List<Coupon> couponSet = new ArrayList<>();
        Coupon coupon6 = Coupon.builder()
                .category(Category.ELECTRICITY)
                .title("Coupon10")
                .companyID(4)
                .description("Purchased coupon to delete with a customer")
                .startDate(Date.valueOf("2024-02-25"))
                .endDate(Date.valueOf("2025-04-26"))
                .amount(1500)
                .price(950)
                .image("")
                .build();

        Coupon coupon7 = Coupon.builder()
                .category(Category.FOOD)
                .title("Coupon11")
                .companyID(5)
                .description("Purchased coupon to delete with a customer")
                .startDate(Date.valueOf("2024-02-25"))
                .endDate(Date.valueOf("2025-04-26"))
                .amount(5000)
                .price(99)
                .image("")
                .build();

        couponSet.add(coupon6);
        couponSet.add(coupon7);
        couponRepository.saveAll(couponSet);

        Customer customer6 = Customer.builder()
                .email("Customer6@gmail.com")
                .firstName("Customer6")
                .lastName("Lastname6")
                .password("Customer6")
                .coupons(couponSet)
                .build();

        //need it for companyService test to delete a coupon which was purchased by a customer.
        Customer customer7 = Customer.builder()
                .email("Customer7@gmail.com")
                .firstName("Customer7")
                .lastName("Lastname7")
                .password("Customer7")
                .coupons(couponSet)
                .build();

        try {
            adminServiceImp.addCustomer(customer6);
            adminServiceImp.addCustomer(customer7);
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        System.out.println("\nCustomer info:\n" + customer6);
        System.out.println("\nCustomer info:\n" + customer7);

        try {
            Customer customerToDelete = customerRepository.findCustomerById(6);
            System.out.println("\nDeleting customerID: " + customerToDelete.getId() + " with purchased coupons");
            adminServiceImp.deleteCustomer(customerToDelete.getId());
            System.out.println("CustomerID: " + customerToDelete.getId() + " was deleted.");

        } catch (Exception err) {
            System.out.println(err.getMessage());
        }

        //-------------------------------------*** AdminController Test*** - printCustomer-----------------------------------
        System.out.println("\n-------------------------*** AdminController Test - printCustomer ***------------------------");
        System.out.println("\nPrinting all Customers:");

        adminServiceImp.getAllCustomers().forEach(System.out::println);

        System.out.println("\nPrinting one customer:");
        try {
            System.out.println(adminServiceImp.getOneCustomer(4));
        } catch (Exception err) {
            System.out.println(err.getMessage());
        }
    }
}
