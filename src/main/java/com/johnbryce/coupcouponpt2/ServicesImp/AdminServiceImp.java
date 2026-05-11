package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.*;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Repository.LoginDetailsRepository;
import com.johnbryce.coupcouponpt2.Services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService {
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final LoginDetailsRepository loginDetailsRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void addCompany(Company company) throws CoupCouponSystemException {
        Company isCompanyExists = companyRepository.findCompanyByNameOrEmail(company.getName(), company.getEmail());
        if (isCompanyExists != null) {
            throw new DuplicateEntityException(ErrorMsg.CANT_ADD_COMPANY);
        }

        Customer isCustomerExists = customerRepository.findCustomerByEmail(company.getEmail());
        if (isCustomerExists != null) {
            throw new DuplicateEntityException(ErrorMsg.CANT_ADD_COMPANY);
        }

        String hashedPassword = passwordEncoder.encode(company.getPassword());

        LoginDTO companyDetails = LoginDTO.builder()
                .email(company.getEmail())
                .password(hashedPassword)
                .name(company.getName())
                .type(UserType.COMPANY)
                .build();

        company.setPassword(hashedPassword);
        companyRepository.save(company);
        loginDetailsRepository.save(companyDetails);
    }

    @Override
    public void updateCompany(int companyID, Company company) throws CoupCouponSystemException {
        Company existing = companyRepository.findCompanyById(companyID);
        if (existing == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }

        if (!existing.getName().equalsIgnoreCase(company.getName()) || existing.getId() != company.getId()) {
            throw new BusinessLogicException(ErrorMsg.CAN_NOT_UPDATE_NAME_OR_ID);
        }

        Company emailOwner = companyRepository.findCompanyByEmail(company.getEmail());
        if (emailOwner != null && emailOwner.getId() != companyID) {
            throw new DuplicateEntityException(ErrorMsg.CAN_NOT_UPDATE_EMAIL_EXISTS);
        }

        LoginDTO loginDetails = loginDetailsRepository.findByEmail(existing.getEmail());

        existing.setEmail(company.getEmail());
        if (company.getPassword() != null && !company.getPassword().isBlank()) {
            String hashedPassword = passwordEncoder.encode(company.getPassword());
            existing.setPassword(hashedPassword);
            loginDetails.setPassword(hashedPassword);
        }

        loginDetails.setEmail(company.getEmail());

        companyRepository.saveAndFlush(existing);
        loginDetailsRepository.saveAndFlush(loginDetails);
    }

    @Override
    public void deleteCompany(int companyID) throws CoupCouponSystemException {
        Company company = companyRepository.findCompanyById(companyID);
        if (company == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }

        LoginDTO loginToDelete = loginDetailsRepository.findByEmail(company.getEmail());
        loginDetailsRepository.deleteById(loginToDelete.getId());
        companyRepository.deleteById(companyID);
    }

    @Override
    public Page<Company> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    @Override
    public Company getOneCompany(int companyID) throws CoupCouponSystemException {
        Company company = companyRepository.findCompanyById(companyID);
        if (company == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }
        return company;
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public void addCustomer(Customer customer) throws CoupCouponSystemException {
        Customer isCustomerExists = customerRepository.findCustomerByEmail(customer.getEmail());
        Company isEmailExists = companyRepository.findCompanyByEmail(customer.getEmail());

        if (isCustomerExists != null) {
            throw new DuplicateEntityException(ErrorMsg.CANT_ADD_CUSTOMER);
        }
        if (isEmailExists != null) {
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
        customerRepository.save(customer);
        loginDetailsRepository.save(customerDetails);
    }

    @Override
    public void updateCustomer(int customerID, Customer customer) throws CoupCouponSystemException {
        Customer existing = customerRepository.findCustomerById(customerID);
        if (existing == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }

        if (!existing.getFirstName().equalsIgnoreCase(customer.getFirstName()) || existing.getId() != customer.getId()) {
            throw new BusinessLogicException(ErrorMsg.CAN_NOT_UPDATE_CUSTOMER_NAME_OR_ID);
        }

        Customer emailOwner = customerRepository.findCustomerByEmail(customer.getEmail());
        if (emailOwner != null && emailOwner.getId() != customerID) {
            throw new DuplicateEntityException(ErrorMsg.CAN_NOT_UPDATE_EMAIL_EXISTS);
        }

        LoginDTO loginDetails = loginDetailsRepository.findByEmail(existing.getEmail());

        existing.setLastName(customer.getLastName());
        existing.setEmail(customer.getEmail());
        loginDetails.setEmail(customer.getEmail());

        loginDetailsRepository.saveAndFlush(loginDetails);
        customerRepository.saveAndFlush(existing);
    }

    @Override
    public void deleteCustomer(int customerID) throws CoupCouponSystemException {
        Customer customer = customerRepository.findCustomerById(customerID);
        if (customer == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }

        LoginDTO loginToDelete = loginDetailsRepository.findByEmail(customer.getEmail());
        loginDetailsRepository.deleteById(loginToDelete.getId());
        customerRepository.deleteById(customerID);
    }

    @Override
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Customer getOneCustomer(int customerID) throws CoupCouponSystemException {
        Customer customer = customerRepository.findCustomerById(customerID);
        if (customer == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }
        return customer;
    }

    @Override
    public void deleteCoupon(int couponID) throws CoupCouponSystemException {
        Coupon coupon = couponRepository.findCouponById(couponID);
        if (coupon == null) {
            throw new EntityNotFoundException(ErrorMsg.ID_NOT_FOUND);
        }
        couponRepository.deleteById(couponID);
    }
}
