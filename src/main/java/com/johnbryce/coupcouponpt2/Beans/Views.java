package com.johnbryce.coupcouponpt2.Beans;

/**
 * The Views class is used to define different levels of visibility for serialization with JSON.
 * By defining different classes (views) within this class, you can control which properties of your
 * Java objects are included in the JSON output for different scenarios. This is particularly useful
 * in APIs where you might want to expose different data sets to different types of users or in different
 * contexts.
 */
public class Views {
    public static class Public{}
    public static class Internal extends Public{}

}
