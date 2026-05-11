package com.johnbryce.coupcouponpt2.Job;

import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DailyJob {
    private static final Logger log = LoggerFactory.getLogger(DailyJob.class);

    private final CouponRepository couponRepository;

    @Transactional
    public void deleteExpiredCoupons() {
        Date now = Date.valueOf(LocalDate.now());

        int expiredCount = couponRepository.deleteCouponsByEndDateIsBefore(now);
        log.info("Daily cleanup: deleted {} expired coupons", expiredCount);
    }
}
