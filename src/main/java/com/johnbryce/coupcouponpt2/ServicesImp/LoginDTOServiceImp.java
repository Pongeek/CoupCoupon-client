package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.BusinessLogicException;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.DuplicateEntityException;
import com.johnbryce.coupcouponpt2.Exceptions.ErrorMsg;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Repository.LoginDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginDTOServiceImp {
    private final LoginDetailsRepository loginDetailsRepository;
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginDTO login(Credentials credentials) throws CoupCouponSystemException {
        LoginDTO loginDetails = loginDetailsRepository.findByEmail(credentials.getEmail());

        if (loginDetails == null || !passwordEncoder.matches(credentials.getPassword(), loginDetails.getPassword())) {
            throw new BusinessLogicException(ErrorMsg.LOGIN_FAILED);
        }

        if (loginDetails.getType().equals(UserType.COMPANY)) {
            Company company = companyRepository.findCompanyByEmail(credentials.getEmail());
            return new LoginDTO(company.getId(), company.getEmail(), company.getName(), loginDetails.getPassword(), loginDetails.getType());
        }

        if (loginDetails.getType().equals(UserType.CUSTOMER)) {
            Customer customer = customerRepository.findCustomerByEmail(credentials.getEmail());
            return new LoginDTO(customer.getId(), customer.getEmail(), customer.getFirstName(), loginDetails.getPassword(), loginDetails.getType());
        }

        return loginDetails;
    }

    public void customerRegister(Customer customer) throws CoupCouponSystemException {
        Customer isCustomerExists = customerRepository.findCustomerByEmail(customer.getEmail());
        Company isCompanyEmailExists = companyRepository.findCompanyByEmail(customer.getEmail());

        if (isCustomerExists != null) {
            throw new DuplicateEntityException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        if (isCompanyEmailExists != null) {
            throw new DuplicateEntityException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        String hashedPassword = passwordEncoder.encode(customer.getPassword());

        LoginDTO customerDetails = LoginDTO.builder()
                .email(customer.getEmail())
                .password(hashedPassword)
                .name(customer.getFirstName())
                .type(UserType.CUSTOMER)
                .build();

        customer.setPassword(hashedPassword);
        loginDetailsRepository.save(customerDetails);
        customerRepository.save(customer);
    }

    public boolean isEmailExists(String email) {
        return loginDetailsRepository.existsByEmail(email);
    }
}
