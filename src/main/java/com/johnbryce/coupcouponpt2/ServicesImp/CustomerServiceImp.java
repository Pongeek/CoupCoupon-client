package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.ErrorMsg;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImp extends ClientService implements CustomerService {

    private final CouponRepository couponRepository;
    private final CustomerRepository customerRepository;
    private int customerID;

    @Override
    public int login(Credentials credentials) throws CoupCouponSystemException {
       Customer customer = customerRepository.findCustomerByEmailAndPassword(credentials.getEmail(), credentials.getPassword());
        System.out.println("Customer Logged in : " + customer);

       if (customer == null) {
           this.customerID = 0;
           throw new CoupCouponSystemException(ErrorMsg.LOGIN_FAILED);
       }
       this.customerID = customer.getId();
        System.out.println("Customer ID: " + customerID);

        return customerID;
    }

    @Override
    public void purchaseCoupon(int couponID) throws CoupCouponSystemException {

        isLoggedIn();

        Coupon isCouponExist = couponRepository.findCouponById(couponID);
        Customer customer = customerRepository.findCustomerById(customerID);
        List<Coupon> customerCouponsList = customer.getCoupons();

        if(isCouponExist == null){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_ID_NOT_FOUND);
        }

        boolean isCouponPurchasedByCustomer = couponRepository.existsByIdAndCustomersId(couponID,customerID);
        if(isCouponPurchasedByCustomer){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_ALREADY_PURCHASED);
        }

        if(isCouponExist.getAmount() <= 1){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_OUT_OF_STOCK);
        }

        if(isCouponExist.getEndDate().getTime() < Calendar.getInstance().getTimeInMillis()){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_DATE_EXPIRED);
        }

        isCouponExist.setAmount(isCouponExist.getAmount() - 1);
        customerCouponsList.add(isCouponExist);
        customer.setCoupons(customerCouponsList);
        customerRepository.saveAndFlush(customer);
    }

    @Override
    public ArrayList<Coupon> getCustomerCoupons() throws CoupCouponSystemException {

        isLoggedIn();

        return couponRepository.findCouponsByCustomersId(customerID);
    }

    @Override
    public ArrayList<Coupon> getCustomerCouponsByCategory(Category category) throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAllByCustomersIdAndCategory(customerID,category);
    }

    @Override
    public ArrayList<Coupon> getCustomerCouponsByMaxPrice(double maxPrice) throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAllByPriceIsLessThanEqualAndCustomersId(maxPrice,customerID);
    }

    @Override
    public Customer getCustomerDetails() throws CoupCouponSystemException {
        isLoggedIn();

        Customer customer = customerRepository.findCustomerById(customerID);

        if(customer == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        return customer;
    }

    @Override
    public List<Coupon> getAllCoupons() throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAll();
    }

    private void isLoggedIn() throws CoupCouponSystemException {
        if (this.customerID == 0) {
            throw new CoupCouponSystemException(ErrorMsg.USER_MUST_LOG_IN);
        }
    }
}
