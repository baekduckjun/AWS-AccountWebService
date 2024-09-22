package account.webservice.product.common.jwt.filter;

import java.io.IOException;
import java.net.URLDecoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import account.webservice.product.common.util.EncryptionUtil;
import account.webservice.product.user.UserDTO;
import account.webservice.product.user.UserEntity;
import account.webservice.product.user.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public LoginFilter(AuthenticationManager authenticationManager) {

        this.authenticationManager = authenticationManager;
    }
    
    @Autowired
    private UserService userService;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

    	// JSON 데이터를 파싱하기 위한 ObjectMapper 생성
        ObjectMapper mapper = new ObjectMapper();
        try {
            // 요청 바디(InputStream)에서 JSON을 읽어 LoginRequest 객체로 변환
            UserDTO userDTO = mapper.readValue(request.getInputStream(), UserDTO.class);
            
            String userID = userDTO.getUserID();
	    	String userPWD = userDTO.getUserPWD();
	    	
	    	EncryptionUtil URLEncoding = new EncryptionUtil();
			userID = URLDecoder.decode(userID, "UTF-8");
			userID = URLEncoding.AESDecrypt(userID);
			userPWD = URLDecoder.decode(userPWD, "UTF-8");
			userPWD = URLEncoding.AESDecrypt(userPWD);
			userPWD = URLEncoding.EncryptSHA256(userPWD);
	        
    		//스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userID, userPWD, null);

    		//token에 담은 검증을 위한 AuthenticationManager로 전달
            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new AuthenticationServiceException("Invalid request format", e);
        } catch (Exception e) {
        	throw new AuthenticationServiceException("Exception", e);
        }
    }

	//로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
    	// JSON 데이터를 파싱하기 위한 ObjectMapper 생성
        ObjectMapper mapper = new ObjectMapper();
        try {
	    	// 요청 바디(InputStream)에서 JSON을 읽어 LoginRequest 객체로 변환
	        UserDTO userDTO = mapper.readValue(request.getInputStream(), UserDTO.class);
	        
	        String userID = userDTO.getUserID();
	    	String userPWD = userDTO.getUserPWD();
	    	
	    	EncryptionUtil URLEncoding = new EncryptionUtil();
			userID = URLDecoder.decode(userID, "UTF-8");
			try {
				userID = URLEncoding.AESDecrypt(userID);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			userPWD = URLDecoder.decode(userPWD, "UTF-8");
			userPWD = URLEncoding.AESDecrypt(userPWD);
			userPWD = URLEncoding.EncryptSHA256(userPWD);
			
			UserEntity DecryptuserEntity =  UserEntity.builder()
	    			.userKey(userDTO.getUserKey())
	    			.userID(userID)
	    			.userPWD(userPWD)
	    			.userName(userDTO.getUserName())
	    			.userEmail(userDTO.getUserEmail())
	    			.userAlias(userDTO.getUserAlias())
	    			.build();
	    	
			UserDTO DecryptuserDTO = UserDTO.toUserDTO(DecryptuserEntity);
			//ID로 조회 후 ID 체크
	    	UserDTO loginmember = userService.doLogin(DecryptuserDTO);
        } catch (IOException e) {
            throw new AuthenticationServiceException("Invalid request format", e);
        } catch (Exception e) {
        	throw new AuthenticationServiceException("Exception", e);
        }
    }

	//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	System.out.println("fail");
    }
}