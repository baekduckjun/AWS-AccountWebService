package account.webservice.product.common.jwt;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import account.webservice.product.common.jwt.filter.LoginFilter;
import account.webservice.product.common.util.EncryptionUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	//AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
	private final AuthenticationConfiguration authenticationConfiguration;
	public SecurityConfig(AuthenticationConfiguration authenticationConfiguration) {

        this.authenticationConfiguration = authenticationConfiguration;
    }
	
	@Bean
	public EncryptionUtil bCryptPasswordEncoder() {
		return new EncryptionUtil();
	}
	
	//AuthenticationManager Bean 등록
	@Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
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
				.requestMatchers("/api/v1/user/create", "/api/v1/user/findbyid", "/api/v1/user/dologin").permitAll()
				.requestMatchers("/api/v1/user/admin").hasRole("ADMIN")
				.anyRequest().authenticated());
		
		LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration));
		loginFilter.setFilterProcessesUrl("/api/v1/user/dologin");
		
		http
			.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
		
		// 세션 설정
		http
			.sessionManagement((session) -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		return http.build();
	}
}
