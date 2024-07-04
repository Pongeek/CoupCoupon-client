package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon,Integer>{
    Coupon findCouponByIdAndCompanyID(int id, int companyId);
    Coupon findCouponById(int couponID);

    ArrayList<Coupon> findAllByCompanyID(int companyID);

    ArrayList<Coupon> findAllByCategoryAndCompanyID(Category category, int companyID);

    ArrayList<Coupon> findAllByPriceIsLessThanEqualAndCompanyID(double price,int companyID);

    ArrayList<Coupon> findCouponsByCustomersId(int customerID);

    boolean existsByIdAndCustomersId(int couponID,int customerID);

    ArrayList<Coupon> findAllByCustomersIdAndCategory(int customerID,Category category);

    ArrayList<Coupon> findAllByPriceIsLessThanEqualAndCustomersId(double price,int customerID);

    Boolean existsByTitleAndCompanyIDAndIdNot(String title,int companyID,int couponID);

    Boolean existsByTitleAndCompanyID(String title,int companyID);

    List<Coupon> findAllByEndDateIsBefore(Date today);

    int deleteCouponsByEndDateIsBefore(Date date);

    List<Coupon> findAllByAmountIsLessThanEqual(int amount);

    void deleteCouponsByAmountIsLessThanEqual(int amount);

}
