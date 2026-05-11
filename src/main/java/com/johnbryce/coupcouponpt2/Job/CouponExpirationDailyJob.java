package com.johnbryce.coupcouponpt2.Job;

import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CouponExpirationDailyJob {

    private static final Logger log = LoggerFactory.getLogger(CouponExpirationDailyJob.class);

    private final CouponRepository couponRepository;

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void deleteExpiredCoupons() {
        Date today = Date.valueOf(LocalDate.now());

        List<Coupon> expiredCoupons = couponRepository.findAllByEndDateIsBefore(today);
        if (!expiredCoupons.isEmpty()) {
            log.info("Found {} expired coupons to delete", expiredCoupons.size());
            int deleted = couponRepository.deleteCouponsByEndDateIsBefore(today);
            log.info("Deleted {} expired coupons", deleted);
        } else {
            log.debug("No expired coupons found");
        }
    }
}
