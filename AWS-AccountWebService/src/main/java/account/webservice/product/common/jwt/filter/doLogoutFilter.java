package account.webservice.product.common.jwt.filter;

import java.io.IOException;

import org.springframework.web.filter.GenericFilterBean;

import account.webservice.product.common.jwt.JWTRefreshRepository;
import account.webservice.product.common.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class doLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final JWTRefreshRepository jwtRefreshRepository;
    private final String logoutURL;

    public doLogoutFilter(JWTUtil jwtUtil, JWTRefreshRepository jwtRefreshRepository, String logoutURL) {

        this.jwtUtil = jwtUtil;
        this.jwtRefreshRepository = jwtRefreshRepository;
        this.logoutURL = logoutURL;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        //path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^.*\\/dologout$")) {

            filterChain.doFilter(request, response);
            return;
        }
        String requestMethod = request.getMethod();
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if ( !(requestMethod.equals("POST") && logoutURL.equals(httpRequest.getRequestURI())) ) {

            filterChain.doFilter(request, response);
            return;
        }

        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        //refresh null check
        if (refresh == null) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //DB에 저장되어 있는지 확인
        Boolean isExist = jwtRefreshRepository.existsByRefresh(refresh);
        if (!isExist) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //로그아웃 진행
        //Refresh 토큰 DB에서 제거
        jwtRefreshRepository.deleteByRefresh(refresh);

        //Refresh 토큰 Cookie 값 0
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        
        // 응답 body에 데이터 작성
        String responseBody = ""
        		+ "{"
        		+	"\"status\": \"Success\","
        		+ 	"\"result\": \"Success\""
        		+ "}";
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
		response.getWriter().write(responseBody);

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}