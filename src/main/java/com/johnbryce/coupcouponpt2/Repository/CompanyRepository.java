package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {

    Company findCompanyById(int companyID);
    Company findCompanyByEmailAndPassword(String email,String password);
    Company findCompanyByNameOrEmail(String name,String email);
    Company findCompanyByEmail(String email);
}
