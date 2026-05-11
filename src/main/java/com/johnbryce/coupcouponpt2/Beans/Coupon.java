package com.johnbryce.coupcouponpt2.Beans;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "coupons")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties(value = {"customers"}, allowSetters = true)
@EntityListeners(AuditingEntityListener.class)
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int companyID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "category")
    @NotNull(message = "Category is required")
    private Category category;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start date is required")
    private Date startDate;

    @NotNull(message = "End date is required")
    private Date endDate;

    @Column(nullable = false)
    @Min(value = 0, message = "Amount cannot be negative")
    private int amount;

    @Column(nullable = false)
    @Min(value = 0, message = "Price cannot be negative")
    private double price;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String image;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "customers_vs_coupons",
            joinColumns = @JoinColumn(name = "coupon_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id"))
    private List<Customer> customers;

    @Version
    @JsonIgnore
    private int version;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Override
    public String toString() {
        return "\nCoupon - { " +
                "id=" + id +
                ", companyID = " + companyID +
                ", category = " + category +
                ", title = '" + title + '\'' +
                ", description = '" + description + '\'' +
                ", startDate = " + startDate +
                ", endDate = " + endDate +
                ", amount = " + amount +
                ", price = " + price +
                ", image = '" + image + '\'' + " }";
    }
}
