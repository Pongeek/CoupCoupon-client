package com.johnbryce.coupcouponpt2.Advice;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class CoupCouponControllerAdvice {

    @ExceptionHandler(value = {JsonProcessingException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorDetails errorHandler(Exception e) {
        return new ErrorDetails("Error - ",e.getMessage());
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorDetails handleValidationExceptions(Exception e) {
        return new ErrorDetails("Validation Error - ",e.getMessage());
    }
}
