package account.webservice.product.account;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import account.webservice.product.account.dto.AccountDTO;
import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;
import account.webservice.product.account.dto.OpenBankkingRequestTokenDTO;
import account.webservice.product.account.dto.OpenBankkingResponseTokenDTO;
import account.webservice.product.account.service.AccountService;
import account.webservice.product.account.service.OpenBankkingRestTemplateService;
import account.webservice.product.common.util.EncryptionUtil;
import account.webservice.product.user.UserDTO;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URI;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

	private final Logger log = LoggerFactory.getLogger(getClass());
	Map<String, Object> response = new HashMap<>();
	
    private final AccountService accountService;
    private final OpenBankkingRestTemplateService openBankkingRestTemplateService;
    private final EncryptionUtil encryptionUtil;

    public AccountController(AccountService accountService, OpenBankkingRestTemplateService openBankkingRestTemplateService, EncryptionUtil encryptionUtil) {
    	this.accountService = accountService;
    	this.openBankkingRestTemplateService = openBankkingRestTemplateService;
    	this.encryptionUtil = encryptionUtil;
    }
    
    //오픈뱅킹 API
    @GetMapping("/authorize")
    //http://localhost:3000/utils/DoAccountAuthorize?code=xVcT5LNr2nWidcJzOVV1TaP6mLtUyd&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    //http://localhost:8080/api/v1/account/authorize?code=X73FOfzwVMSroZd1CCz3myzm7myFW8&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    public ResponseEntity<Map<String, Object>> authorizeAccount(OpenBankkingAuthorizeDTO openBankkingAuthorizeDTO) {
    	try {
    		//openBankkingAuthorizeDTO = encryptionUtil.DecryptUser(userDTO);
    		
    		
	    	//String createUserResult = userService.createUser(userDTO);
	    	log.info("createUserResult = {}", openBankkingAuthorizeDTO);
	    	ResponseEntity<OpenBankkingResponseTokenDTO> result = openBankkingRestTemplateService.getTokenAPI(openBankkingAuthorizeDTO);
	    	if (result.getBody().getAccess_token() != null) {
	    		response.put("status", "Success");
	    		response.put("result", "Success");
	    	} else {
	    		response.put("status", "Error");
	    		response.put("result", result.getBody().getRsp_message());
	    	}
	    	
	    	return ResponseEntity.status(HttpStatus.FOUND)
	        		.location(URI.create("http://localhost:3000/components/MainPage/Main"))
	                .build();
			
    	} catch (Exception e){
    		response.put("status", "Error");
    		response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.status(HttpStatus.FOUND)
		    		.location(URI.create("http://localhost:3000/components/MainPage/Main"))
		            .build();
        }
    }
    
    //오픈뱅킹 API
    @GetMapping("/getaccountinfo")
    //http://localhost:3000/utils/DoAccountAuthorize?code=xVcT5LNr2nWidcJzOVV1TaP6mLtUyd&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    //http://localhost:8080/api/v1/account/authorize?code=X73FOfzwVMSroZd1CCz3myzm7myFW8&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    public ResponseEntity<Map<String, Object>> getAccountInfo(OpenBankkingResponseTokenDTO openBankkingResponseTokenDTO) {
    	try {
    		//openBankkingAuthorizeDTO = encryptionUtil.DecryptUser(userDTO);
    		
    		
	    	//String createUserResult = userService.createUser(userDTO);
	    	log.info("createUserResult = {}", openBankkingResponseTokenDTO);
	    	if ("Success".equals(openBankkingResponseTokenDTO)) {
	    		response.put("status", "Success");
	    		response.put("result", "Success");
	            response.put("data", openBankkingResponseTokenDTO);
	    	} else {
	    		response.put("status", "Success");
	    		response.put("result", "Exists");
	            response.put("data", openBankkingResponseTokenDTO);
	    	}
	    	
	        return ResponseEntity.ok(response);
    	} catch (Exception e){
    		response.put("status", "Error");
    		response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
        }
    }
    
    @PostMapping("/sign")
    //http://localhost:3000/utils/DoAccountAuthorize?code=xVcT5LNr2nWidcJzOVV1TaP6mLtUyd&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    //http://localhost:8080/api/v1/account/authorize?code=X73FOfzwVMSroZd1CCz3myzm7myFW8&scope=inquiry%20login%20transfer&client_info=test&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY
    public ResponseEntity<Map<String, Object>> signAccount(@RequestBody AccountDTO accountDTO) {
    	
    	try {
    		accountDTO = encryptionUtil.DecryptAccount(accountDTO);

    		String createAccountResult = accountService.signAccount(accountDTO);
	    	log.info("createUserResult = {}", accountDTO);
	    	if ("Success".equals(createAccountResult)) {
	    		response.put("status", "Success");
	    		response.put("result", "Success");
	            response.put("data", accountDTO);
	    	} else {
	    		response.put("status", "Success");
	    		response.put("result", "Exists");
	            response.put("data", accountDTO);
	    	}
	    	
	        return ResponseEntity.ok(response);
    	} catch (Exception e){
    		response.put("status", "Error");
    		response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
        }
    }
    
    @PostMapping("/findbyaccountnumber")
    public ResponseEntity<Map<String, Object>> findByAccountNumber(@RequestBody AccountDTO accountDTO) {
    
    	try {
    		accountDTO = encryptionUtil.DecryptAccount(accountDTO);
    		AccountDTO findByAccountNumberResult = accountService.findByAccountNumber(accountDTO);
			
    		findByAccountNumberResult = encryptionUtil.EncryptAccount(findByAccountNumberResult, "");
	        if (findByAccountNumberResult == null) {
	        	response.put("status", "Success");
	        	response.put("result", "Not Exsits");
	        } else {
	        	response.put("status", "Success");
	        	response.put("result", "Exsits");
	            response.put("data", findByAccountNumberResult);
	        }
	        return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("status", "Error");
			response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
		}
    }
}