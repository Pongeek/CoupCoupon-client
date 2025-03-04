package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.ErrorMsg;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Services.CompanyService;
import com.johnbryce.coupcouponpt2.Utils.JWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CompanyServiceImp extends ClientService implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CouponRepository couponRepository;
    private final LoginDTOServiceImp loginDTOServiceImp;
    private int companyID;

    @Override
    public int login(Credentials credentials) throws CoupCouponSystemException {
        Company company = companyRepository.findCompanyByEmailAndPassword(credentials.getEmail(), credentials.getPassword());
        System.out.println("Company Logged in : " + company);
        if (company == null) {
            this.companyID = 0;
            throw new CoupCouponSystemException(ErrorMsg.LOGIN_FAILED);
        }
        this.companyID = company.getId();
        System.out.println("CompanyID: " + companyID);
        return companyID;
    }


    @Override
    public void addCoupon(Coupon coupon) throws CoupCouponSystemException {

        isLoggedIn();

        boolean isCouponTitleExists = couponRepository.existsByTitleAndCompanyID(coupon.getTitle(),companyID);
        Company company = companyRepository.findCompanyById(companyID);
        List<Coupon> couponList = company.getCoupons();

        if(coupon.getCompanyID() != companyID){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_CAN_NOT_BE_ADDED);
        }

        if (isCouponTitleExists){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_TITLE_ALREADY_EXISTS);
        }

        couponList.add(coupon);
        couponRepository.save(coupon);
        company.setCoupons(couponList);
        companyRepository.saveAndFlush(company);
    }

    @Override
    public void updateCoupon(int couponID,Coupon coupon) throws CoupCouponSystemException {

        isLoggedIn();

        Coupon isCouponExists = couponRepository.findCouponByIdAndCompanyID(couponID,companyID);

        if(isCouponExists == null){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_ID_NOT_FOUND);
        }

        if(couponID != coupon.getId()){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_CAN_NOT_BE_UPDATED);
        }

        if(companyID != coupon.getCompanyID()){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_CAN_NOT_BE_UPDATED);
        }


        // Check if the title is being changed to something that exists under the same company but different ID
        if (!isCouponExists.getTitle().equals(coupon.getTitle())) {
            boolean titleExists = couponRepository.existsByTitleAndCompanyIDAndIdNot(coupon.getTitle(),
                    coupon.getCompanyID(), couponID);
            if (titleExists) {
                throw new CoupCouponSystemException(ErrorMsg.COUPON_TITLE_ALREADY_EXISTS);
            }
        }

        isCouponExists.setTitle(coupon.getTitle());
        isCouponExists.setDescription(coupon.getDescription());
        isCouponExists.setAmount(coupon.getAmount());
        isCouponExists.setEndDate(coupon.getEndDate());
        isCouponExists.setStartDate(coupon.getStartDate());
        isCouponExists.setImage(coupon.getImage());
        isCouponExists.setPrice(coupon.getPrice());
        isCouponExists.setAmount(coupon.getAmount());
        isCouponExists.setCategory(coupon.getCategory());

        couponRepository.saveAndFlush(isCouponExists);
    }

    @Override
    public void deleteCoupon(int couponID) throws CoupCouponSystemException {
        isLoggedIn();

        Coupon isCouponExists = couponRepository.findCouponByIdAndCompanyID(couponID,companyID);

        if(isCouponExists == null){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_ID_NOT_FOUND);
        }

        if(isCouponExists.getCompanyID() != companyID){
            throw new CoupCouponSystemException(ErrorMsg.COUPON_CAN_NOT_BE_DELETED);
        }

        couponRepository.deleteById(couponID);
    }


    @Override
    public ArrayList<Coupon> getAllCompanyCoupons() throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAllByCompanyID(companyID);
    }

    @Override
    public ArrayList<Coupon> getCompanyCouponsByCategory(Category category) throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAllByCategoryAndCompanyID(category,companyID);
    }

    @Override
    public ArrayList<Coupon> getCompanyCouponsByPrice(double price) throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAllByPriceIsLessThanEqualAndCompanyID(price,companyID);
    }

    @Override
    public Company getCompany() throws CoupCouponSystemException {
        isLoggedIn();
        Company company = companyRepository.findCompanyById(companyID);

        if(company == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }
        return company;
    }

    private void isLoggedIn() throws CoupCouponSystemException {
        if (this.companyID == 0){
            throw new CoupCouponSystemException(ErrorMsg.USER_MUST_LOG_IN);
        }
    }


}
