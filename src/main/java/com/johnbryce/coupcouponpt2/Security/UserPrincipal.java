package com.johnbryce.coupcouponpt2.Security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPrincipal {
    private final int id;
    private final String email;
    private final String userType;
}
