package com.johnbryce.coupcouponpt2.Beans;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.sql.Date;
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
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Public.class)
    private int id;

    @JsonView(Views.Public.class)
    @Column(nullable = false)
    private int companyID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "category")
    @JsonView(Views.Public.class)
    private Category category;

    @Column(nullable = false)
    @JsonView(Views.Public.class)
    private String title;

    @Column(nullable = false)
    @JsonView(Views.Public.class)
    private String description;

    @JsonView(Views.Public.class)
    private Date startDate;

    @JsonView(Views.Public.class)
    private Date endDate;

    @Column(nullable = false)
    @Min(1)
    @JsonView(Views.Public.class)
    private int amount;

    @Column(nullable = false)
    @Min(0)
    @JsonView(Views.Public.class)
    private double price;

    @JsonView(Views.Public.class)
    private String image;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "customers_vs_coupons",
            joinColumns = @JoinColumn(name = "coupon_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id"))
    @JsonView(Views.Public.class)
    private List<Customer> customers;

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
