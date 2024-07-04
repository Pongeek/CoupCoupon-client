package com.johnbryce.coupcouponpt2.Exceptions;

import lombok.Getter;

@Getter
public enum ErrorMsg {

    LOGIN_FAILED("Log in failed, incorrect password or email"),

    CANT_ADD_COMPANY("Failed to add a new company into the database" +
            " - Email or name already exists in the database!"),

    ID_NOT_FOUND(" ID does not exist in the database."),

    CAN_NOT_UPDATE_NAME_OR_ID("Update Failed: Company's Name and ID can not be updated."),

    CAN_NOT_UPDATE_EMAIL_EXISTS("Update Failed: Email already exists in the database."),

    CANT_ADD_CUSTOMER("Failed to add a new customer into the database" +
            " - Email already exists in the database!"),

    COUPON_TITLE_ALREADY_EXISTS("Coupon title already exists for this company in the database."),

    COUPON_CAN_NOT_BE_ADDED("Company must be logged in to add a coupon."),

    COUPON_ID_NOT_FOUND("CouponID does not exist in the database."),

    COUPON_CAN_NOT_BE_UPDATED("CouponID and CompanyID can't be updated"),

    COUPON_CAN_NOT_BE_DELETED("Unauthorized to delete this coupon"),

    COUPON_ALREADY_PURCHASED("The customer already has purchased this coupon."),

    COUPON_OUT_OF_STOCK("Coupon out of stock."),

    COUPON_DATE_EXPIRED("Coupon date has expired."),
    USER_MUST_LOG_IN("Unauthorized to do it."),
    CAN_NOT_UPDATE_CUSTOMER_NAME_OR_ID("Update Failed: Customer's Name and ID can not be updated.");




    private String msg;
    ErrorMsg(String msg) {
        this.msg = msg;
    }
}