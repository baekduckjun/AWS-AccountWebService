package account.webservice.product.common.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
	private final JWTRefreshLogRepository jwtRefreshLogRepository;
	
    public JWTController(JWTUtil jwtUtil, JWTRefreshRepository jwtRefreshRepository, JWTRefreshLogRepository jwtRefreshLogRepository) {
        this.jwtUtil = jwtUtil;
        this.jwtRefreshRepository = jwtRefreshRepository;
        this.jwtRefreshLogRepository = jwtRefreshLogRepository;
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
        	Map<String, String> responseBody = new HashMap<>();
            responseBody.put("status", "Success");
            responseBody.put("result", "Refresh Token is Null");

            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
        	//response status code
        	Map<String, String> responseBody = new HashMap<>();
            responseBody.put("status", "Success");
            responseBody.put("result", "Refresh Token Expired");
        	
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
        	//response status code
        	Map<String, String> responseBody = new HashMap<>();
            responseBody.put("status", "Success");
            responseBody.put("result", "Invalid Token Category");
        	
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }
        
        //DB에 저장되어 있는지 확인
    	Boolean isExist = jwtRefreshRepository.existsByRefresh(refresh);
    	if (!isExist) {
    		//response status code
    		Map<String, String> responseBody = new HashMap<>();
            responseBody.put("status", "Success");
            responseBody.put("result", "Refresh Token DB Not Exist");
    		
    		return new ResponseEntity<>(responseBody, HttpStatus.OK);
    	}

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
    	jwtRefreshRepository.deleteByRefresh(refresh);
    	JWTRefreshEntity refreshEntity = jwtUtil.addRefreshEntity(username, newRefresh, 86400000L);
    	JWTRefreshLogEntity refreshLogEntity = jwtUtil.addRefreshLogEntity(username, newRefresh, 86400000L);
    	jwtRefreshRepository.save(refreshEntity);
    	jwtRefreshLogRepository.save(refreshLogEntity);
        
        //response
        response.setHeader("access", newAccess);
        response.addCookie(jwtUtil.createCookie("refresh", newRefresh));
        
        // 성공 응답 생성
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("status", "Success");
        responseBody.put("result", "Success");

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
    
}
