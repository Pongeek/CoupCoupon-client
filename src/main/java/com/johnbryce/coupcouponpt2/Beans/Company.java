package com.johnbryce.coupcouponpt2.Beans;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties(value = {"coupons"}, allowSetters = true,allowGetters = true)
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Public.class)
    private int id;

    @Column(length = 45, unique = true, nullable = false)
    @JsonView(Views.Public.class)
    private String name;

    @Column(length = 45, unique = true, nullable = false)
    @JsonView(Views.Public.class)
    private String email;

    @Column(nullable = false)
    @JsonView(Views.Public.class)
    private String password;

    @OneToMany(mappedBy="companyID",cascade = CascadeType.ALL, fetch = FetchType.EAGER,orphanRemoval = true)
    @Singular
    @JsonView(Views.Public.class)
    private List<Coupon> coupons;

    @Override
    public String toString() {
        return "Company- { " +
                "id = " + id +
                ", name = '" + name + '\'' +
                ", email = '" + email + '\'' +
                ", password = '" + password + '\'' + "\n" +
                "coupons = " + coupons + " }";
    }


}

