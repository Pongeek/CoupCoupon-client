package com.johnbryce.coupcouponpt2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
public class CoupCouponPt2Application {

    public static void main(String[] args) {
        SpringApplication.run(CoupCouponPt2Application.class, args);
    }

}
