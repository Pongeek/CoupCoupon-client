# Overview
This project is a full-stack web application that integrates a React TypeScript frontend with a Java Spring backend and uses MySQL for data storage.
The application is designed to provide a seamless user experience with efficient data management and robust backend support.

## Project Structure
- **Frontend**: Built with React and TypeScript, the frontend provides a dynamic and responsive user interface. It leverages Redux for state management, ensuring the application state is predictable and easy to debug.
- **Backend**: Developed using the Java Spring framework, the backend handles business logic, data processing, and communication with the database. It exposes RESTful APIs that the front end consumes.
- **Database**: MySQL is the relational database management system, that stores all the necessary data for the application.

## Key Technologies
- **React**: A JavaScript library for building user interfaces, used here with TypeScript for type safety.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **Redux**: A predictable state container for JavaScript apps that manages the application state.
- **Java Spring**: A comprehensive framework for enterprise Java development, used for building the backend services.
- **MySQL**: A widely-used open-source relational database management system.
- **CSS**: Cascading Style Sheets, used for styling the front end to ensure a visually appealing and responsive design.
- **REST API**: The backend exposes RESTful APIs for communication between the frontend and backend.
- **JWT (JSON Web Tokens)**: Used for secure user authentication and authorization.
- **HTML

## Features
- **User Authentication**: Secure login and registration system using JWT.
- **Data Management**: CRUD operations for managing data entities.
- **State Management**: Efficient state handling using Redux.
- **Responsive Design**: Mobile-friendly user interface.

 ## Access Levels
Access to the system is divided into three types of clients:

- **Administrator**: 
  - Manages the entire system.
  - Responsible for managing the lists of companies and customers.
  - Has the highest level of access and can perform all administrative tasks.

- **Company**: 
  - Manages a list of coupons associated with the company.
  - Can create, update, and delete coupons.
  - Has access to company-specific data and operations.

- **Customer**: 
  - Buys coupons.
  - Can view and purchase available coupons.
  - Has access to customer-specific data and operations.
 

  ## Controllers

The application uses several controllers to handle different aspects of the system. Here's an overview of each controller and its functions:

### AdminController

The AdminController handles all administrative operations. An admin can perform the following actions:

1. Add a new company
2. Update an existing company
3. Delete a company
4. Get all companies
5. Get a specific company by ID
6. Get all coupons in the system
7. Add a new customer
8. Update an existing customer
9. Delete a customer
10. Get all customers
11. Get a specific customer by ID
12. Delete a Coupon

### CompanyController

The CompanyController manages operations related to companies. A company can perform the following actions:

1. Add a new coupon
2. Update an existing coupon
3. Delete a Coupon
4. Get all coupons from the company
5. Get company coupons by category
6. Get company coupons by maximum price
7. Get company details

### CustomerController

The CustomerController handles customer-related operations. A customer can perform the following actions:

1. Purchase a coupon
2. Get all purchased coupons
3. Get purchased coupons by category
4. Get purchased coupons at a maximum price
5. Get customer details
6. Get all available coupons

(Note: The CustomerController code snippet was not provided, but these functions are typically included for customer operations.)

### LoginDTOController

The LoginDTOController is responsible for handling user authentication and registration. It performs the following functions:

1. User login (for Admin, Company, and Customer)
2. Customer registration
3. Check if an email already exists in the system

This controller manages the log in process for all user types and generates JWT tokens for authenticated users. It also handles the creation of new customer accounts.

## Frontend Overview

### Project Structure

The front end of the CoupCoupon project is built using React with TypeScript. The project follows a typical React application structure with components, utilities, and state management.

### Key Technologies

- React
- TypeScript
- Redux for state management
- Axios for API calls

### API Integration and Authentication

The project uses a custom Axios instance with interceptors to handle authentication and token management. This is implemented in the `AxiosJWT.ts` file:

This configuration does the following:

1. Creates a custom Axios instance.
2. Adds a request interceptor to automatically add the JWT token to the Authorization header of each request.
3. Adds a response interceptor to update the token in Redux and sessionStorage if a new token is received in the response headers.

This setup ensures that:
- All API requests are authenticated with the current JWT token.
- The token is automatically refreshed when the server provides a new one.
- The updated token is stored both in Redux for application-wide state and in sessionStorage for persistence across page reloads.

This approach to handling JWTs is crucial for maintaining secure communication with the backend while providing a seamless user experience.





 
