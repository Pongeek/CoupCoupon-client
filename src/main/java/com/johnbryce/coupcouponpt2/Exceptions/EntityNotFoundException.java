package com.johnbryce.coupcouponpt2.Exceptions;

public class EntityNotFoundException extends CoupCouponSystemException {
    public EntityNotFoundException(ErrorMsg errorMsg) {
        super(errorMsg);
    }
}
