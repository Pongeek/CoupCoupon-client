package com.johnbryce.coupcouponpt2.Advice;

import com.johnbryce.coupcouponpt2.Exceptions.BusinessLogicException;
import com.johnbryce.coupcouponpt2.Exceptions.CoupCouponSystemException;
import com.johnbryce.coupcouponpt2.Exceptions.DuplicateEntityException;
import com.johnbryce.coupcouponpt2.Exceptions.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class CoupCouponControllerAdvice {

    private static final Logger log = LoggerFactory.getLogger(CoupCouponControllerAdvice.class);

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(EntityNotFoundException e, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, e.getMessage(), request);
    }

    @ExceptionHandler(DuplicateEntityException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicate(DuplicateEntityException e, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage(), request);
    }

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessLogic(BusinessLogicException e, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage(), request);
    }

    @ExceptionHandler(CoupCouponSystemException.class)
    public ResponseEntity<ApiErrorResponse> handleSystem(CoupCouponSystemException e, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException e, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage()));

        ApiErrorResponse response = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("One or more fields are invalid")
                .path(request.getRequestURI())
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Access denied", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneral(Exception e, HttpServletRequest request) {
        log.error("Unexpected error at {}: {}", request.getRequestURI(), e.getMessage(), e);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(HttpStatus status, String message, HttpServletRequest request) {
        ApiErrorResponse response = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(response);
    }
}
