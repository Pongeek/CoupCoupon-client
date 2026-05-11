package com.johnbryce.coupcouponpt2.Services;

import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {

    void addCompany(Company company) throws CoupCouponSystemException;

    void updateCompany(int companyID, Company company) throws CoupCouponSystemException;

    void deleteCompany(int companyID) throws CoupCouponSystemException;

    Page<Company> getAllCompanies(Pageable pageable);

    Company getOneCompany(int companyID) throws CoupCouponSystemException;

    List<Coupon> getAllCoupons();

    void addCustomer(Customer customer) throws CoupCouponSystemException;

    void updateCustomer(int customerID, Customer customer) throws CoupCouponSystemException;

    void deleteCustomer(int customerID) throws CoupCouponSystemException;

    Page<Customer> getAllCustomers(Pageable pageable);

    Customer getOneCustomer(int customerID) throws CoupCouponSystemException;

    void deleteCoupon(int couponID) throws CoupCouponSystemException;
}

