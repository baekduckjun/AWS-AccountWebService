package account.webservice.product.account.service.impl;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;
import account.webservice.product.account.dto.OpenBankkingRequestTokenDTO;
import account.webservice.product.account.dto.OpenBankkingResponseTokenDTO;
import account.webservice.product.account.service.OpenBankkingRestTemplateService;
import account.webservice.product.common.jwt.CustomUserDetails;
import account.webservice.product.common.util.DateTimeUtil;
import account.webservice.product.common.util.EncryptionUtil;

@Service
public class OpenBankkingRestTemplateServiceImpl implements OpenBankkingRestTemplateService{

    @Autowired
    private final EncryptionUtil encryptionUtil;
    private final Logger log = LoggerFactory.getLogger(getClass());
    
    public OpenBankkingRestTemplateServiceImpl(EncryptionUtil encryptionUtil) {
        this.encryptionUtil = encryptionUtil;
    }
    
    @Override
    public ResponseEntity<OpenBankkingResponseTokenDTO> getTokenAPI(OpenBankkingAuthorizeDTO openBankkingAuthorizeDTO) {
    	
    	URI uri = UriComponentsBuilder
    			.fromUriString("https://testapi.openbanking.or.kr")
    			.path("/oauth/2.0/token")
    			.encode()
    			.build()
    			.toUri();
    	
    	OpenBankkingRequestTokenDTO request = new OpenBankkingRequestTokenDTO();
    	request.setCode(openBankkingAuthorizeDTO.getCode());
    	request.setClient_id("7517f0fc-f71a-4487-b6d7-e45e139f8611");
    	request.setClient_secret("ea0bc4ce-8dae-42fe-b517-c59d4a2aa812");
    	request.setRedirect_uri("http://localhost:3000/api/v1/account/token");
    	request.setGrant_type("authorization_code");
    	
    	RestTemplate restTemplate = new RestTemplate();
    	ResponseEntity<OpenBankkingResponseTokenDTO> responseEntity = restTemplate.postForEntity(uri, request, OpenBankkingResponseTokenDTO.class);
    	
    	return responseEntity;
    }
    
    @Override
    public ResponseEntity<OpenBankkingResponseTokenDTO> getAccountInfoAPI(OpenBankkingAuthorizeDTO openBankkingAuthorizeDTO) {
    	
    	URI uri = UriComponentsBuilder
    			.fromUriString("https://testapi.openbanking.or.kr")
    			.path("/oauth/2.0/token")
    			.encode()
    			.build()
    			.toUri();
    	
    	OpenBankkingRequestTokenDTO request = new OpenBankkingRequestTokenDTO();
    	request.setCode(openBankkingAuthorizeDTO.getCode());
    	request.setClient_id("7517f0fc-f71a-4487-b6d7-e45e139f8611");
    	request.setClient_secret("ea0bc4ce-8dae-42fe-b517-c59d4a2aa812");
    	request.setRedirect_uri("http://localhost:3000/api/v1/account/token");
    	request.setGrant_type("authorization_code");
    	
    	RestTemplate restTemplate = new RestTemplate();
    	ResponseEntity<OpenBankkingResponseTokenDTO> responseEntity = restTemplate.postForEntity(uri, request, OpenBankkingResponseTokenDTO.class);
    	
    	return responseEntity;
    }
}