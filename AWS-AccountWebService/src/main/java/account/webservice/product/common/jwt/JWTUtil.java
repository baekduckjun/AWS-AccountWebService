package account.webservice.product.common.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;

@Component
public class JWTUtil {
	
	private SecretKey secretKey;
	
	public JWTUtil(@Value("${SPRING.APP.JWT.ENCRYPTKEY}")String secret) {
		secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
	}
	
	public String getUsername(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

	public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }
	
    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }
    
    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
    
    public String createJwt(String category, String username, String role, Long expiredMs) {

        return Jwts.builder()
        		.claim("category", category)
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    
    public JWTRefreshEntity addRefreshEntity(String userID, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        JWTRefreshEntity refreshEntity = new JWTRefreshEntity();
        refreshEntity.setUserID(userID);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        return refreshEntity;
    }
    
    public JWTRefreshLogEntity addRefreshLogEntity(String userID, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        JWTRefreshLogEntity refreshLogEntity = new JWTRefreshLogEntity();
        refreshLogEntity.setUserID(userID);
        refreshLogEntity.setRefresh(refresh);
        refreshLogEntity.setExpiration(date.toString());

        return (refreshLogEntity);
    }
    
}
