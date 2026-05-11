package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.*;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Security.SecurityUtils;
import com.johnbryce.coupcouponpt2.Services.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImp implements CustomerService {

    private final CouponRepository couponRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    @Override
    public void purchaseCoupon(int couponID) throws CoupCouponSystemException {
        int customerID = SecurityUtils.getCurrentUserId();

        Coupon coupon = couponRepository.findById(couponID)
                .orElseThrow(() -> new EntityNotFoundException(ErrorMsg.COUPON_ID_NOT_FOUND));
        Customer customer = customerRepository.findById(customerID)
                .orElseThrow(() -> new EntityNotFoundException(ErrorMsg.CUSTOMER_DOES_NOT_EXIST));

        boolean alreadyPurchased = couponRepository.existsByIdAndCustomersId(couponID, customerID);
        if (alreadyPurchased) {
            throw new BusinessLogicException(ErrorMsg.COUPON_ALREADY_PURCHASED);
        }

        if (coupon.getAmount() < 1) {
            throw new BusinessLogicException(ErrorMsg.COUPON_OUT_OF_STOCK);
        }

        if (coupon.getEndDate().getTime() < Calendar.getInstance().getTimeInMillis()) {
            throw new BusinessLogicException(ErrorMsg.COUPON_DATE_EXPIRED);
        }

        coupon.setAmount(coupon.getAmount() - 1);
        customer.getCoupons().add(coupon);

        couponRepository.save(coupon);
        customerRepository.saveAndFlush(customer);
    }

    @Override
    public ArrayList<Coupon> getCustomerCoupons() {
        int customerID = SecurityUtils.getCurrentUserId();
        return couponRepository.findCouponsByCustomersId(customerID);
    }

    @Override
    public ArrayList<Coupon> getCustomerCouponsByCategory(Category category) {
        int customerID = SecurityUtils.getCurrentUserId();
        return couponRepository.findAllByCustomersIdAndCategory(customerID, category);
    }

    @Override
    public ArrayList<Coupon> getCustomerCouponsByMaxPrice(double maxPrice) {
        int customerID = SecurityUtils.getCurrentUserId();
        return couponRepository.findAllByPriceIsLessThanEqualAndCustomersId(maxPrice, customerID);
    }

    @Override
    public Customer getCustomerDetails() throws CoupCouponSystemException {
        int customerID = SecurityUtils.getCurrentUserId();
        Customer customer = customerRepository.findCustomerById(customerID);
        if (customer == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }
        return customer;
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }
}
