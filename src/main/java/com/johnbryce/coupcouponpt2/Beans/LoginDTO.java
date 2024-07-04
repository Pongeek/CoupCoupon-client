package com.johnbryce.coupcouponpt2.Beans;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Builder
public class LoginDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String name;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserType type;


    public LoginDTO(int id, String email, String name, String password, UserType type) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.type = type;
    }

    public LoginDTO(String email,String password,UserType type) {
        this.email = email;
        this.password = password;
        this.type = type;
    }



    @Override
    public String toString() {
        return "Login{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", type='" + type + '\'' +
                '}';
    }



}


