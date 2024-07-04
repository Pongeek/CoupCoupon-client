package com.johnbryce.coupcouponpt2.CLR;

import com.johnbryce.coupcouponpt2.Job.DailyJob;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;



@Component
@Order(4)
@RequiredArgsConstructor
public class JobTest implements CommandLineRunner {

    private final DailyJob dailyJob;


    @Override
    @Scheduled(fixedRate = 86400000)
    public void run(String... args) throws Exception {

        //   _____                                ______            _           _   _               _______        _
        //  / ____|                              |  ____|          (_)         | | (_)             |__   __|      | |
        // | |     ___  _   _ _ __   ___  _ __   | |__  __  ___ __  _ _ __ __ _| |_ _  ___  _ __      | | ___  ___| |_
        // | |    / _ \| | | | '_ \ / _ \| '_ \  |  __| \ \/ / '_ \| | '__/ _` | __| |/ _ \| '_ \     | |/ _ \/ __| __|
        // | |___| (_) | |_| | |_) | (_) | | | | | |____ >  <| |_) | | | | (_| | |_| | (_) | | | |    | |  __/\__ \ |_
        //  \_____\___/ \__,_| .__/ \___/|_| |_| |______/_/\_\ .__/|_|_|  \__,_|\__|_|\___/|_| |_|    |_|\___||___/\__|
        //                   | |                             | |
        //                   |_|                             |_|

        //------------------------------------*** DailyJob Test ***---------------------------------------------
        System.out.println("-------------------------------*** DailyJob Test ***---------------------------------------");

        try{
            dailyJob.deleteExpiredCoupons();
        }catch (Exception e){
            System.out.println("Error during expiration check of coupons: " + e.getMessage());
        }

    }
}
