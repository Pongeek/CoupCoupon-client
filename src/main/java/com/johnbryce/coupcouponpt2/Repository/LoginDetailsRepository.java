package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.LoginDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginDetailsRepository extends JpaRepository<LoginDTO, Integer> {

    LoginDTO findByEmail(String email);
    LoginDTO findByEmailAndPassword(String email, String password);
    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

}
