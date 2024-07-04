package com.johnbryce.coupcouponpt2.Exceptions;

public class CoupCouponSystemException extends Exception {

    public CoupCouponSystemException(ErrorMsg errorMsg) {
        super(errorMsg.getMsg());
    }
}
