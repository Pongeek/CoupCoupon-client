package com.johnbryce.coupcouponpt2.Beans;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customers")
@Builder
@Getter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties(value = {"coupons"}, allowSetters = true,allowGetters = true)
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Public.class)
    private int id;

    @Column(nullable = false)
    @JsonView(Views.Public.class)
    private String firstName;

    @JsonView(Views.Public.class)
    @Column(nullable = false)
    private String lastName;

    @JsonView(Views.Public.class)
    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    @JsonView(Views.Public.class)
    private String password;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "customers_vs_coupons",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "coupon_id"))
    @JsonView(Views.Public.class)
    private List<Coupon> coupons;

    @Override
    public String toString() {
        return "Customer - { " +
                "id = " + id +
                ", firstName = '" + firstName + '\'' +
                ", lastName = '" + lastName + '\'' +
                ", email = '" + email + '\'' +
                ", password = '" + password + '\'' + "\n" +
                "coupons = " + (coupons != null ? coupons.toString() : "") + " }";
    }

}
