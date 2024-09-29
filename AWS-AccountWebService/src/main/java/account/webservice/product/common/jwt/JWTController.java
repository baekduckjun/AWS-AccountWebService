package account.webservice.product.common.jwt;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1")
@ResponseBody
public class JWTController {
	private final JWTUtil jwtUtil;
	private final JWTRefreshRepository jwtRefreshRepository;

    public JWTController(JWTUtil jwtUtil, JWTRefreshRepository jwtRefreshRepository) {
        this.jwtUtil = jwtUtil;
        this.jwtRefreshRepository = jwtRefreshRepository;
    }

    @PostMapping("/jwtrefresh")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {

            //response status code
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        
        //DB에 저장되어 있는지 확인
    	Boolean isExist = jwtRefreshRepository.existsByRefresh(refresh);
    	if (!isExist) {
    		
    		   //response body
    		   return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
    	}

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
    	jwtRefreshRepository.deleteByRefresh(refresh);
    	addRefreshEntity(username, newRefresh, 86400000L);
        
        //response
        response.setHeader("access", newAccess);
        response.addCookie(jwtUtil.createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    private void addRefreshEntity(String userID, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        JWTRefreshEntity refreshEntity = new JWTRefreshEntity();
        refreshEntity.setUserID(userID);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        jwtRefreshRepository.save(refreshEntity);
    }
}
