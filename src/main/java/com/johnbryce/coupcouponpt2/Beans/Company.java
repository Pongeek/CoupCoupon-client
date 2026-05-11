package com.johnbryce.coupcouponpt2.Beans;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties(value = {"coupons"}, allowSetters = true, allowGetters = true)
@EntityListeners(AuditingEntityListener.class)
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 45, unique = true, nullable = false)
    @NotBlank(message = "Company name is required")
    @Size(max = 45, message = "Company name must not exceed 45 characters")
    private String name;

    @Column(length = 45, unique = true, nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 45, message = "Email must not exceed 45 characters")
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @OneToMany(mappedBy = "companyID", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Singular
    private List<Coupon> coupons;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

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

