package com.johnbryce.coupcouponpt2.Job;

import com.johnbryce.coupcouponpt2.Beans.Coupon;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CouponExpirationDailyJob implements Runnable {

    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private PlatformTransactionManager transactionManager;

    private volatile boolean quit = false;


    @Override
    public void run() {
        while (!quit) {
            try {
                TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
                transactionTemplate.execute(status -> {
                    Date today = Date.valueOf(LocalDate.now());
                    System.out.println(today);

                    List<Coupon> allExpiredCoupons = couponRepository.findAllByEndDateIsBefore(today);
                    System.out.println("-------List of expired coupons--------");
                    allExpiredCoupons.forEach(System.out::println);

                    List<Coupon> outOfStockCoupons = couponRepository.findAllByAmountIsLessThanEqual(1);
                    System.out.println("-------List of out-of-stock coupons--------");
                    outOfStockCoupons.forEach(System.out::println);

                    System.out.println("Deleting all expired coupons");
                    couponRepository.deleteCouponsByEndDateIsBefore(today);

                    System.out.println("Deleting all expired coupons");
                    couponRepository.deleteCouponsByAmountIsLessThanEqual(1);
                    return null; // Return value not used
                });

                TimeUnit.HOURS.sleep(24);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("CouponExpirationDailyJob was interrupted: " + e.getMessage());
            }
        }
    }

    public void stopJob(){
        quit = true;
    }
}
