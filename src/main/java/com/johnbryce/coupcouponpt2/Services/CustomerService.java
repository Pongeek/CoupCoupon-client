package com.johnbryce.coupcouponpt2.Services;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;

import java.util.ArrayList;
import java.util.List;

public interface CustomerService {

    void purchaseCoupon(int couponID) throws CoupCouponSystemException;
    ArrayList<Coupon> getCustomerCoupons() throws CoupCouponSystemException;
    ArrayList<Coupon> getCustomerCouponsByCategory(Category category) throws CoupCouponSystemException;
    ArrayList<Coupon> getCustomerCouponsByMaxPrice(double maxPrice) throws CoupCouponSystemException;
    Customer getCustomerDetails() throws CoupCouponSystemException;
    List<Coupon> getAllCoupons() throws CoupCouponSystemException;
}
