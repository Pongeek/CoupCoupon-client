package com.johnbryce.coupcouponpt2.Utils;

import com.johnbryce.coupcouponpt2.Beans.Company;
import com.johnbryce.coupcouponpt2.Beans.Customer;
import com.johnbryce.coupcouponpt2.Beans.LoginDTO;
import io.jsonwebtoken.*;
import org.hibernate.usertype.UserType;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.security.auth.login.LoginException;
import java.security.Key;
import java.security.SignatureException;
import java.sql.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWT {

    //type of encryption - אלגוריתם הצפנה - header
    private final String signatureAlgorithm = SignatureAlgorithm.HS256.getJcaName();
    //our private key - מפתח הצפנה שקיים רק אצלנו
    private final String encodedSecretKey = "uri+wants+to+lechartet+somthing+good+for+the+class";
    //create our private key = יצירה של מפתח ההצפנה לשימוש ביצירה של הטוקנים שלנו - VERIFY SIGNATURE
    private final Key decodedSecretKey = new SecretKeySpec(Base64.getDecoder().decode(encodedSecretKey),this.signatureAlgorithm);

    //create payload
    //we need user email, password and role for create the token
    //since the userDetail is an instance of the information in the hashcode
    //the token need to get claims which is the information in the hashcode



    public String generateToken(LoginDTO loginDTO) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", loginDTO.getId());
        claims.put("name", loginDTO.getName());
        claims.put("userType", loginDTO.getType());
        return createToken(claims, loginDTO.getEmail());
    }

    public String generateToken(Company company,LoginDTO loginDTO) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", company.getId());
        claims.put("name", company.getName());
        claims.put("userType", loginDTO.getType());
        return createToken(claims, company.getEmail());
    }

    public String generateToken(Customer customer,LoginDTO loginDTO) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", customer.getId());
        claims.put("name", customer.getFirstName());
        claims.put("userType", loginDTO.getType());
        return createToken(claims, customer.getEmail());
    }



    public String generateToken(String token) throws SignatureException {
        Map<String, Object> claims = new HashMap<>();
        Claims ourClaims = extractAllClaims(token);
        claims.put("id", ourClaims.get("id"));
        claims.put("name", ourClaims.get("name"));
        claims.put("userType", ourClaims.get("userType"));
        return createToken(claims, ourClaims.getSubject());
    }

    //we create the JWT token from the information that we got.
    private String createToken(Map<String, Object> claims, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims) //get claims
                .setSubject(email) //get subject
                .setIssuedAt(Date.from(now)) //get current time
                .setExpiration(Date.from(now.plus(30, ChronoUnit.MINUTES)))  //expiration date
                .signWith(this.decodedSecretKey)
                .compact();
    }

    public Claims extractAllClaims(String token) throws ExpiredJwtException, SignatureException {
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(decodedSecretKey) //provide our secret key :)
                .build();
        return jwtParser.parseClaimsJws(token).getBody();
    }

    public String extractEmail(String token) throws SignatureException {
        return extractAllClaims(token).getSubject();
    }

    public java.util.Date extractExpirationDate(String token) throws SignatureException {
        return extractAllClaims(token).getExpiration();
    }

    public boolean isTokenExpired(String token) {
        try {
            extractAllClaims(token);
            return false;
        } catch (ExpiredJwtException | SignatureException err) {
            return true;
        }
    }

    public String getUserType(String token) throws SignatureException {
        Claims claims = extractAllClaims(token);
        return (String) claims.get("userType");
    }

    public boolean validateToken(String token, LoginDTO loginDTO) throws MalformedJwtException, SignatureException {
        final String userEmail = extractEmail(token);
        return (userEmail.equals(loginDTO.getEmail()) && !isTokenExpired(token));
    }

    public boolean validateToken(String token) throws MalformedJwtException, SignatureException{
        final Claims claims = extractAllClaims(token);
        System.out.println(claims.getSubject());
        return true;
    }

    public boolean checkUser(String token, UserType userType) throws LoginException, SignatureException {
        String newToken = token.replace("Bearer ", "");
        if (validateToken(newToken)) {
            if (!getUserType(newToken).equals(userType)) {
                throw new LoginException("User not allowed");
            }
        }
        return true;
    }

}
