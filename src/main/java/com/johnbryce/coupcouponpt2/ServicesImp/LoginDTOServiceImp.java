package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.ErrorMsg;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Repository.LoginDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginDTOServiceImp{
    private final LoginDetailsRepository loginDetailsRepository;
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;


    public LoginDTO login(Credentials credentials) throws CoupCouponSystemException {
        LoginDTO loginDetails = loginDetailsRepository.findByEmailAndPassword(credentials.getEmail(),credentials.getPassword());

        if(loginDetails==null){
            throw new CoupCouponSystemException(ErrorMsg.LOGIN_FAILED);
        }


        if(loginDetails.getType().equals(UserType.COMPANY)){
            Company company = companyRepository.findCompanyByEmail(credentials.getEmail());
            return new LoginDTO(company.getId(),company.getEmail(),company.getName(),company.getPassword(),loginDetails.getType());
        }

        if(loginDetails.getType().equals(UserType.CUSTOMER)){
            Customer customer = customerRepository.findCustomerByEmail(credentials.getEmail());
            return new LoginDTO(customer.getId(),customer.getEmail(),customer.getFirstName(),customer.getPassword(),loginDetails.getType());
        }

        return new LoginDTO(loginDetails.getId(),loginDetails.getEmail(),loginDetails.getName(),loginDetails.getPassword(),loginDetails.getType());
    }

    public void customerRegister(Customer customer) throws CoupCouponSystemException {
        Customer isCustomerExists = customerRepository.findCustomerByEmail(customer.getEmail());
        Company isCompanyEmailExists = companyRepository.findCompanyByEmail(customer.getEmail());

        if(isCustomerExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        if(isCompanyEmailExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        LoginDTO customerDetails = LoginDTO.builder()
                .email(customer.getEmail())
                .password(customer.getPassword())
                .name(customer.getFirstName())
                .type(UserType.CUSTOMER)
                .build();

        loginDetailsRepository.save(customerDetails);
        customerRepository.save(customer);

    }

    public boolean isEmailExists(String email){
        return loginDetailsRepository.existsByEmail(email);
    }
}
