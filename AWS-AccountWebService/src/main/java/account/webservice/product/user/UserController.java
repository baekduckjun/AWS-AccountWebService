package account.webservice.product.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import account.webservice.product.common.util.EncryptionUtil;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	private final Logger log = LoggerFactory.getLogger(getClass());
	Map<String, Object> response = new HashMap<>();
	
    @Autowired
    private UserService userService;
    

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody UserDTO userDTO) {
    	String createUserResult = userService.createUser(userDTO);
    	log.info("createUserResult = {}", createUserResult);
    	if ("Success".equals(createUserResult)) {
    		response.put("result", "Success");
            response.put("data", createUserResult);
    	} else {
    		response.put("result", "Fail");
            response.put("data", createUserResult);
    	}
    	
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/findbyid")
    public ResponseEntity<Map<String, Object>> findByUserID(@RequestBody UserDTO user) {
    
    	try {
    		String userID = user.getUserID();
    		
    		EncryptionUtil URLEncoding = new EncryptionUtil();
    		userID = URLDecoder.decode(userID, "UTF-8");
			userID = URLEncoding.AESDecrypt(userID);
			UserDTO findByUserIDResult = userService.findByUserID(userID);
	        
	        if (findByUserIDResult == null) {
	        	response.put("result", "Not Exsits");
	        } else {
	        	response.put("result", "Success");
	            response.put("data", findByUserIDResult);
	        }
	        return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
		}
    }
    
    @PostMapping("/dologin")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
		try {
			String userID = userDTO.getUserID();
	    	String userPWD = userDTO.getUserPWD();
	    	
	    	EncryptionUtil URLEncoding = new EncryptionUtil();
			userID = URLDecoder.decode(userID, "UTF-8");
			userID = URLEncoding.AESDecrypt(userID);
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
	        
	        if (loginmember == null) {
	        	response.put("result", "Not Exists userID");
	        } else {
	        	// 비밀번호가 맞는지 체크
	        	if (userPWD.equals(loginmember.getUserPWD())) {
	        		response.put("result", "Success");
	                response.put("data", loginmember);
	        	} else {
	        		response.put("result", "Not Exists memberPWD");
	        	}
	        }
	        return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
		}
    }
}