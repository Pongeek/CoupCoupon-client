package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.Customer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    Customer findCustomerById(int customerID);
    Customer findCustomerByEmail(String email);
    Customer findCustomerByEmailAndPassword(String email,String password);
    @EntityGraph(attributePaths = {"coupons"})
    Optional<Customer> findById(Integer id);
}

