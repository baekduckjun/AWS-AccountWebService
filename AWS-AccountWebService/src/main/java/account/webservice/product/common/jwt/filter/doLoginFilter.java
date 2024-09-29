package account.webservice.product.common.jwt.filter;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import account.webservice.product.common.jwt.CustomUserDetails;
import account.webservice.product.common.jwt.JWTRefreshEntity;
import account.webservice.product.common.jwt.JWTRefreshRepository;
import account.webservice.product.common.jwt.JWTUtil;
import account.webservice.product.common.util.EncryptionUtil;
import account.webservice.product.user.UserDTO;
import account.webservice.product.user.UserEntity;
import account.webservice.product.user.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class doLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager; //AuthenticationManager 주입
	private final JWTUtil jwtUtil; //JWTUtil 주입
	private final JWTRefreshRepository jwtRefreshRepository; //JWTRefreshRepository 주입

    public doLoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, JWTRefreshRepository jwtRefreshRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.jwtRefreshRepository = jwtRefreshRepository;
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
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
		
    	//UserDetailsS
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String userID = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String access = jwtUtil.createJwt("access", userID, role, 600000L);
        String refresh = jwtUtil.createJwt("refresh", userID, role, 86400000L);
        
        //Refresh 토큰 저장
        addRefreshEntity(userID, refresh, 86400000L);

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(jwtUtil.createCookie("refresh", refresh));
        
        // 응답 body에 데이터 작성
        String responseBody = "{\"result\": \"Success\"}";
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
		response.getWriter().write(responseBody);
		
        response.setStatus(HttpStatus.OK.value());
    }
    
    private void addRefreshEntity(String userID, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        JWTRefreshEntity refreshEntity = new JWTRefreshEntity();
        refreshEntity.setUserID(userID);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        jwtRefreshRepository.save(refreshEntity);
    }

	//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	//로그인 실패시 401 응답 코드 반환
        response.setStatus(401);
    }
}