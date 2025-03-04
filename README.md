# CoupCoupon - Coupon Management System

CoupCoupon is a full-stack web application for managing digital coupons, connecting companies offering discounts with customers looking to save. The system provides different interfaces for administrators, companies, and customers.


## Project Overview

This project integrates a modern React TypeScript frontend with a robust Java Spring Boot backend and MySQL database storage. The application offers:

- **Secure Authentication**: JWT-based authentication for three user types (Admin, Company, Customer)
- **Role-Based Access**: Different interfaces and capabilities for each user type
- **Modern UI**: Responsive design with Material-UI components
- **State Management**: Centralized with Redux

## Key Features

### For Administrators
- Manage companies and customers (add, update, delete)
- View all coupons in the system
- Monitor and manage system activity

### For Companies
- Create and manage coupons with various categories
- Update coupon details (price, expiration date, etc.)
- Track coupon purchases

### For Customers
- Browse available coupons with filtering options
- Purchase coupons
- View purchase history
- Filter coupons by category or price range

## Technology Stack

### Frontend
- **React**: Library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Redux**: State management
- **Material-UI**: React component library
- **CSS**: Custom styling

### Backend
- **Java Spring Boot**: Main framework for the backend
- **Spring Security**: Authentication and authorization
- **JPA/Hibernate**: ORM for database operations
- **RESTful APIs**: Communication between frontend and backend

### Database
- **MySQL**: Relational database for data storage

## Project Structure

The project is organized into two main components:

### Frontend (`/CoupCouponFront`)
- React components for different user interfaces
- Redux store for state management
- API services for backend communication
- CSS styling for a responsive design

### Backend (`/src`)
- Controllers for handling HTTP requests
- Services for business logic
- Repositories for data access
- Models/Beans for data representation
- Security configuration for JWT and CORS

## Getting Started

### Prerequisites
- Node.js and npm for the frontend
- Java JDK 11+ for the backend
- MySQL server

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd CoupCouponFront/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. The application will be available at `http://localhost:3000`

### Backend Setup
1. Configure the database connection in `src/main/resources/application.properties`
2. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   or using an IDE like IntelliJ IDEA
3. The backend server will start at `http://localhost:8080`

## User Access Levels

### Administrator
- Full system management capabilities
- Can add, update, and delete companies and customers
- Has access to all coupons in the system

### Company
- Company-specific coupon management
- Can create, update, and delete their own coupons
- Can view purchase statistics

### Customer
- Can view and purchase available coupons
- Can view their purchase history
- Can filter coupons by category or price

## Screenshots

*Coming soon*

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the JohnBryce Training team
- Icons provided by Material Icons
- All contributors to this project







 
