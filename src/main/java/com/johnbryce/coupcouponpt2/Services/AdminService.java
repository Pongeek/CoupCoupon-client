package com.johnbryce.coupcouponpt2.Services;

import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;

import java.util.List;

public interface AdminService {

    void addCompany(Company company) throws CoupCouponSystemException;

    void updateCompany(int companyID,Company company) throws CoupCouponSystemException;

    void deleteCompany(int companyID) throws CoupCouponSystemException;

    List<Company> getAllCompanies() throws CoupCouponSystemException;

    Company getOneCompany(int companyID) throws CoupCouponSystemException;

    List<Coupon> getAllCoupons() throws CoupCouponSystemException;

    void addCustomer(Customer customer) throws CoupCouponSystemException;

    void updateCustomer(int customerID,Customer customer) throws CoupCouponSystemException;

    void deleteCustomer(int customerID) throws CoupCouponSystemException;

    List<Customer> getAllCustomers() throws CoupCouponSystemException;

    Customer getOneCustomer(int customerID) throws CoupCouponSystemException;

    void deleteCoupon(int couponID) throws CoupCouponSystemException;
}

