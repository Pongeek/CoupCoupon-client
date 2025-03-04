package com.johnbryce.coupcouponpt2.ServicesImp;

import com.johnbryce.coupcouponpt2.Beans.*;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.ErrorMsg;
import com.johnbryce.coupcouponpt2.Repository.CompanyRepository;
import com.johnbryce.coupcouponpt2.Repository.CouponRepository;
import com.johnbryce.coupcouponpt2.Repository.CustomerRepository;
import com.johnbryce.coupcouponpt2.Repository.LoginDetailsRepository;
import com.johnbryce.coupcouponpt2.Services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImp extends ClientService implements AdminService {
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final LoginDetailsRepository loginDetailsRepository;
    private final LoginDTOServiceImp loginDTOServiceImp;
    private final CouponRepository couponRepository;
    private int adminID;

    @Override
    public int login(Credentials credentials) throws CoupCouponSystemException {

        LoginDTO loginDTO = loginDTOServiceImp.login(credentials);
        if(loginDTO.getType().equals(UserType.ADMIN)){
            this.adminID = loginDTO.getId();
            return adminID;
        }

        return 0;
    }

    @Override
    public void addCompany(Company company) throws CoupCouponSystemException {

        isLoggedIn();

        String name = company.getName();
        String email = company.getEmail();
        Company isCompanyExists = companyRepository.findCompanyByNameOrEmail(name,email);

        if(isCompanyExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_COMPANY);
        }

        Customer isCustomerExists = customerRepository.findCustomerByEmail(email);
        if(isCustomerExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_COMPANY);
        }

        LoginDTO companyDetails = LoginDTO.builder()
                .email(company.getEmail())
                .password(company.getPassword())
                .name(company.getName())
                .type(UserType.COMPANY)
                .build();

        companyRepository.save(company);
        loginDetailsRepository.save(companyDetails);

    }

    @Override
    public void updateCompany(int companyID,Company company) throws CoupCouponSystemException {
        isLoggedIn();

        // Retrieve the existing company from the database
        Company isCompanyExists = companyRepository.findCompanyById(companyID);
        LoginDTO companyDetails = loginDetailsRepository.findByEmail(isCompanyExists.getEmail());

        System.out.println("isCompanyExists = " + isCompanyExists);
        System.out.println("companyDetails =  " + companyDetails);
        System.out.println("company that was sent - " + company);

        if(isCompanyExists == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        //Check if the company's name and ID can be updated
        if(!(isCompanyExists.getName().equalsIgnoreCase(company.getName())) ||
                isCompanyExists.getId() != company.getId()){
            throw new CoupCouponSystemException(ErrorMsg.CAN_NOT_UPDATE_NAME_OR_ID);
        }

        //Check if the new email already exists in the database
        Company isCompanyEmailExists = companyRepository.findCompanyByEmail(company.getEmail());
        if (isCompanyEmailExists != null && !(company.getEmail().equalsIgnoreCase(isCompanyEmailExists.getEmail()))) {
            throw new CoupCouponSystemException(ErrorMsg.CAN_NOT_UPDATE_EMAIL_EXISTS);
        }


        isCompanyExists.setName(company.getName());
        isCompanyExists.setEmail(company.getEmail());
        isCompanyExists.setPassword(company.getPassword());

        companyDetails.setEmail(company.getEmail());
        companyDetails.setPassword(company.getPassword());

        companyRepository.saveAndFlush(isCompanyExists);
        loginDetailsRepository.saveAndFlush(companyDetails);

    }

    @Override
    public void deleteCompany(int companyID) throws CoupCouponSystemException {
        isLoggedIn();

        Company isCompanyExists = companyRepository.findCompanyById(companyID);


        if(isCompanyExists == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        LoginDTO loginToDelete = loginDetailsRepository.findByEmail(isCompanyExists.getEmail());

        loginDetailsRepository.deleteById(loginToDelete.getId());
        companyRepository.deleteById(companyID);

    }

    @Override
    public List<Company> getAllCompanies() throws CoupCouponSystemException {
        isLoggedIn();
        return companyRepository.findAll();
    }

    @Override
    public Company getOneCompany(int companyID) throws CoupCouponSystemException {
        isLoggedIn();
        Company printCompany =  companyRepository.findCompanyById(companyID);

        if(printCompany == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }
        return printCompany;
    }

    @Override
    public List<Coupon> getAllCoupons() throws CoupCouponSystemException {
        isLoggedIn();
        return couponRepository.findAll();

    }

    @Override
    public void addCustomer(Customer customer) throws CoupCouponSystemException {
        isLoggedIn();

        // Checks if customer's email already exists in the database
        String customerEmail = customer.getEmail();
        Customer isCustomerByEmailExists = customerRepository.findCustomerByEmail(customerEmail);
        Company isEmailExists = companyRepository.findCompanyByEmail(customer.getEmail());

        if(isCustomerByEmailExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        if(isEmailExists != null){
            throw new CoupCouponSystemException(ErrorMsg.CANT_ADD_CUSTOMER);
        }

        LoginDTO customerDetails = LoginDTO.builder()
                .email(customer.getEmail())
                .password(customer.getPassword())
                .name(customer.getFirstName())
                .type(UserType.CUSTOMER)
                .build();

        customerRepository.save(customer);
        loginDetailsRepository.save(customerDetails);
    }

    @Override
    public void updateCustomer(int customerID,Customer customer) throws CoupCouponSystemException {
        isLoggedIn();

        //Retrieve an existing customer from the database, if not then throw an exception.
        Customer isCustomerExists = customerRepository.findCustomerById(customerID);
        LoginDTO customerDetails = loginDetailsRepository.findByEmail(isCustomerExists.getEmail());


        if(isCustomerExists == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        if(!(isCustomerExists.getFirstName().equalsIgnoreCase(customer.getFirstName()))
        || isCustomerExists.getId() != customer.getId()){
            throw new CoupCouponSystemException(ErrorMsg.CAN_NOT_UPDATE_CUSTOMER_NAME_OR_ID);
        }

        //Retrieve the customer by email to check if it already exists in the database, if exist throw an exception.
        Customer isCustomerByEmailExists = customerRepository.findCustomerByEmail(customer.getEmail());

        if(isCustomerByEmailExists != null && !(customer.getEmail().equals(isCustomerByEmailExists.getEmail()))){
            throw new CoupCouponSystemException(ErrorMsg.CAN_NOT_UPDATE_EMAIL_EXISTS);
        }



        isCustomerExists.setLastName(customer.getLastName());
        isCustomerExists.setEmail(customer.getEmail());

        customerDetails.setEmail(customer.getEmail());

        loginDetailsRepository.saveAndFlush(customerDetails);
        customerRepository.saveAndFlush(isCustomerExists);
    }

    @Override
    public void deleteCustomer(int customerID) throws CoupCouponSystemException {
        isLoggedIn();

        Customer customerToDelete = customerRepository.findCustomerById(customerID);

        if(customerToDelete == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        LoginDTO loginToDelete = loginDetailsRepository.findByEmail(customerToDelete.getEmail());

        loginDetailsRepository.deleteById(loginToDelete.getId());
        customerRepository.deleteById(customerID);

    }

    @Override
    public List<Customer> getAllCustomers() throws CoupCouponSystemException {
        isLoggedIn();
        return customerRepository.findAll();
    }

    @Override
    public Customer getOneCustomer(int customerID) throws CoupCouponSystemException {
        isLoggedIn();
        Customer customerToPrint = customerRepository.findCustomerById(customerID);

        if(customerToPrint == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        return customerToPrint;
    }

    @Override
    public void deleteCoupon(int couponID) throws CoupCouponSystemException {
        isLoggedIn();
        Coupon couponToDelete = couponRepository.findCouponById(couponID);

        if(couponToDelete == null){
            throw new CoupCouponSystemException(ErrorMsg.ID_NOT_FOUND);
        }

        couponRepository.deleteById(couponID);

    }

    private void isLoggedIn() throws CoupCouponSystemException {
        if (this.adminID == 0){
            throw new CoupCouponSystemException(ErrorMsg.USER_MUST_LOG_IN);
        }
    }

}
