package com.johnbryce.coupcouponpt2.Services;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;

import java.util.List;

public interface CompanyService {

    void addCoupon(Coupon coupon) throws CoupCouponSystemException;
    void updateCoupon(int couponID,Coupon coupon) throws CoupCouponSystemException;
    void deleteCoupon(int couponID) throws CoupCouponSystemException;
    List<Coupon> getAllCompanyCoupons() throws CoupCouponSystemException;
    List<Coupon> getCompanyCouponsByCategory(Category category) throws CoupCouponSystemException;
    List<Coupon> getCompanyCouponsByPrice(double price) throws CoupCouponSystemException;
    Company getCompany() throws CoupCouponSystemException;
}
