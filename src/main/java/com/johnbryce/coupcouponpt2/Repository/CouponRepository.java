package com.johnbryce.coupcouponpt2.Repository;

import com.johnbryce.coupcouponpt2.Beans.Category;
import com.johnbryce.coupcouponpt2.Beans.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    Coupon findCouponByIdAndCompanyID(int id, int companyId);

    Coupon findCouponById(int couponID);

    ArrayList<Coupon> findAllByCompanyID(int companyID);

    ArrayList<Coupon> findAllByCategoryAndCompanyID(Category category, int companyID);

    ArrayList<Coupon> findAllByPriceIsLessThanEqualAndCompanyID(double price, int companyID);

    ArrayList<Coupon> findCouponsByCustomersId(int customerID);

    boolean existsByIdAndCustomersId(int couponID, int customerID);

    ArrayList<Coupon> findAllByCustomersIdAndCategory(int customerID, Category category);

    ArrayList<Coupon> findAllByPriceIsLessThanEqualAndCustomersId(double price, int customerID);

    Boolean existsByTitleAndCompanyIDAndIdNot(String title, int companyID, int couponID);

    Boolean existsByTitleAndCompanyID(String title, int companyID);

    List<Coupon> findAllByEndDateIsBefore(Date today);

    int deleteCouponsByEndDateIsBefore(Date date);

    List<Coupon> findAllByAmountIsLessThanEqual(int amount);

    void deleteCouponsByAmountIsLessThanEqual(int amount);

    // Paginated queries
    Page<Coupon> findAllByCompanyID(int companyID, Pageable pageable);

    Page<Coupon> findCouponsByCustomersId(int customerID, Pageable pageable);

    @Query("SELECT c FROM Coupon c WHERE " +
            "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR c.category = :category) " +
            "AND (:maxPrice IS NULL OR c.price <= :maxPrice)")
    Page<Coupon> searchCoupons(
            @Param("search") String search,
            @Param("category") Category category,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);
}
