package com.johnbryce.coupcouponpt2.Advice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ErrorDetails {
    private String key;
    private String value;
}
