package com.johnbryce.coupcouponpt2.Job;

import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Utils.PrintUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DailyJob {
    private static final Logger logger = LoggerFactory.getLogger(DailyJob.class);

    private final CouponRepository couponRepository;

    @Transactional
    public void deleteExpiredCoupons() {
        PrintUtils.dailyJob();

        Date now = Date.valueOf(LocalDate.now());
        List<Coupon> allExpiredCoupons = couponRepository.findAllByEndDateIsBefore(now);
        List<Coupon> outOfStock = couponRepository.findAllByAmountIsLessThanEqual(1);

        System.out.println("Checking for expired coupons as of " + now);
        allExpiredCoupons.forEach(System.out::println);

        System.out.println("Checking for out-of-stock coupons as of " + now);
        outOfStock.forEach(System.out::println);

        int deletedCount = couponRepository.deleteCouponsByEndDateIsBefore(now);
        couponRepository.deleteCouponsByAmountIsLessThanEqual(1);
        deletedCount += outOfStock.size();

        System.out.println("Deleted " + deletedCount + " expired coupons");

    }

}
