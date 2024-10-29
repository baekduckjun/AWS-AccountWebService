package account.webservice.product.common.jwt;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import account.webservice.product.common.jwt.filter.JWTFilter;
import account.webservice.product.common.jwt.filter.doLoginFilter;
import account.webservice.product.common.jwt.filter.doLogoutFilter;
import account.webservice.product.common.util.EncryptionUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	//AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil jwtUtil; //JWTUtil 주입
	private final JWTRefreshRepository jwtRefreshRepository; //JWTRefreshRepository 주입
	private final JWTRefreshLogRepository jwtRefreshLogRepository; //JWTRefreshLogRepository 주입
	private final EncryptionUtil encryptionUtil;
	
	public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, JWTRefreshRepository jwtRefreshRepository, JWTRefreshLogRepository jwtRefreshLogRepository, EncryptionUtil encryptionUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.jwtRefreshRepository = jwtRefreshRepository;
        this.jwtRefreshLogRepository = jwtRefreshLogRepository;
        this.encryptionUtil = encryptionUtil;
    }
	
	/*
	@Bean
	public EncryptionUtil bCryptPasswordEncoder() {
		return encryptionUtil;
	}
	*/
	
	//AuthenticationManager Bean 등록
	@Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http
			.cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
        			
    			@Override
    			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
    				CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://baekduduck.duckdns.org"));
                    configuration.setAllowedMethods(Collections.singletonList("*"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("*"));
                    configuration.setMaxAge(3600L);

					configuration.setExposedHeaders(Collections.singletonList("Access"));

                    return configuration;
    			}
    		})));
		
		// csrf disable
		http
			.csrf((auth) -> auth.disable());
		
		// from 로그인 방식 disable
		http
			.formLogin((auth) -> auth.disable());
		
		// http basic 인증 방식 disable
		http
			.httpBasic((auth) -> auth.disable());
		
		http
			.authorizeRequests((auth) -> auth 
				.requestMatchers("/", "/error", "/index.html", "/static/**", "/api/v1/jwtrefresh").permitAll()
				.requestMatchers("/api/v1/user/create", "/api/v1/user/findbyid", "/api/v1/user/dologin").permitAll()
				.requestMatchers("/api/v1/user/admin").hasRole("ADMIN")
				.anyRequest().authenticated());
		
		
		doLoginFilter loginFilter = new doLoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, jwtRefreshRepository, jwtRefreshLogRepository, encryptionUtil);
		loginFilter.setFilterProcessesUrl("/api/v1/user/dologin");
		
		String logoutURL = "/api/v1/user/dologout";
		doLogoutFilter logoutFilter = new doLogoutFilter(jwtUtil, jwtRefreshRepository, logoutURL);
		
		//JWTFilter 등록
        http
            .addFilterBefore(new JWTFilter(jwtUtil), doLoginFilter.class);
        
		http
			.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
		
		http
        	.addFilterBefore(logoutFilter, LogoutFilter.class);
		
		// 세션 설정
		http
			.sessionManagement((session) -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		return http.build();
	}
}
