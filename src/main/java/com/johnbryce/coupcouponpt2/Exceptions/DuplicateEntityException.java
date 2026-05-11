package com.johnbryce.coupcouponpt2.Exceptions;

public class DuplicateEntityException extends CoupCouponSystemException {
    public DuplicateEntityException(ErrorMsg errorMsg) {
        super(errorMsg);
    }
}
