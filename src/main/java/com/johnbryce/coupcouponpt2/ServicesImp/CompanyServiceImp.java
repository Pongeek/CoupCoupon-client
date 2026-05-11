package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.*;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Security.SecurityUtils;
import com.johnbryce.coupcouponpt2.Services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyServiceImp implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CouponRepository couponRepository;

    @Override
    public void addCoupon(Coupon coupon) throws CoupCouponSystemException {
        int companyID = SecurityUtils.getCurrentUserId();

        boolean isCouponTitleExists = couponRepository.existsByTitleAndCompanyID(coupon.getTitle(), companyID);
        if (isCouponTitleExists) {
            throw new DuplicateEntityException(ErrorMsg.COUPON_TITLE_ALREADY_EXISTS);
        }

        coupon.setCompanyID(companyID);

        Company company = companyRepository.findCompanyById(companyID);
        List<Coupon> couponList = company.getCoupons();
        couponList.add(coupon);

        couponRepository.save(coupon);
        company.setCoupons(couponList);
        companyRepository.saveAndFlush(company);
    }

    @Override
    public void updateCoupon(int couponID, Coupon coupon) throws CoupCouponSystemException {
        int companyID = SecurityUtils.getCurrentUserId();

        Coupon existing = couponRepository.findCouponByIdAndCompanyID(couponID, companyID);
        if (existing == null) {
            throw new EntityNotFoundException(ErrorMsg.COUPON_ID_NOT_FOUND);
        }

        if (couponID != coupon.getId()) {
            throw new BusinessLogicException(ErrorMsg.COUPON_CAN_NOT_BE_UPDATED);
        }

        if (!existing.getTitle().equals(coupon.getTitle())) {
            boolean titleExists = couponRepository.existsByTitleAndCompanyIDAndIdNot(coupon.getTitle(), companyID, couponID);
            if (titleExists) {
                throw new DuplicateEntityException(ErrorMsg.COUPON_TITLE_ALREADY_EXISTS);
            }
        }

        existing.setTitle(coupon.getTitle());
        existing.setDescription(coupon.getDescription());
        existing.setAmount(coupon.getAmount());
        existing.setEndDate(coupon.getEndDate());
        existing.setStartDate(coupon.getStartDate());
        existing.setImage(coupon.getImage());
        existing.setPrice(coupon.getPrice());
        existing.setCategory(coupon.getCategory());

        couponRepository.saveAndFlush(existing);
    }

    @Override
    public void deleteCoupon(int couponID) throws CoupCouponSystemException {
        int companyID = SecurityUtils.getCurrentUserId();

        Coupon existing = couponRepository.findCouponByIdAndCompanyID(couponID, companyID);
        if (existing == null) {
            throw new EntityNotFoundException(ErrorMsg.COUPON_ID_NOT_FOUND);
        }

        couponRepository.deleteById(couponID);
    }

    @Override
    public ArrayList<Coupon> getAllCompanyCoupons() {
        int companyID = SecurityUtils.getCurrentUserId();
        return couponRepository.findAllByCompanyID(companyID);
    }

    @Override
    public ArrayList<Coupon> getCompanyCouponsByCategory(Category category) {
        int companyID = SecurityUtils.getCurrentUserId();
        return couponRepository.findAllByCategoryAndCompanyID(category, companyID);
    }

    @Override
    public ArrayList<Coupon> getCompanyCouponsByPrice(double price) {
        int companyID = SecurityUtils.getCurrentUserId();
        return couponRepository.findAllByPriceIsLessThanEqualAndCompanyID(price, companyID);
    }

    @Override
    public Company getCompany() throws CoupCouponSystemException {
        int companyID = SecurityUtils.getCurrentUserId();
        Company company = companyRepository.findCompanyById(companyID);
        if (company == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }
        return company;
    }
}
