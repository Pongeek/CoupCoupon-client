package com.johnbryce.coupcouponpt2.Exceptions;

public class BusinessLogicException extends CoupCouponSystemException {
    public BusinessLogicException(ErrorMsg errorMsg) {
        super(errorMsg);
    }
}
