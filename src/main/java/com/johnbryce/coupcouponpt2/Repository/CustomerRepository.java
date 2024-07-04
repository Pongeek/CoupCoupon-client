package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    Customer findCustomerById(int customerID);
    Customer findCustomerByEmail(String email);
    Customer findCustomerByEmailAndPassword(String email,String password);

}