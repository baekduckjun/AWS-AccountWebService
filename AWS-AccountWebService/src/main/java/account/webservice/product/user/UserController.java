package account.webservice.product.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import account.webservice.product.common.util.EncryptionUtil;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	private final Logger log = LoggerFactory.getLogger(getClass());
	Map<String, Object> response = new HashMap<>();
	
    private final UserService userService;
    private final EncryptionUtil encryptionUtil;

    public UserController(UserService userService, EncryptionUtil encryptionUtil) {
    	this.userService = userService;
    	this.encryptionUtil = encryptionUtil;
    }
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody UserDTO userDTO) {
    	try {
    		userDTO = DecryptUser(userDTO);
	    	String createUserResult = userService.createUser(userDTO);
	    	log.info("createUserResult = {}", createUserResult);
	    	if ("Success".equals(createUserResult)) {
	    		response.put("result", "Success");
	            response.put("data", createUserResult);
	    	} else {
	    		response.put("result", "Exists");
	            response.put("data", createUserResult);
	    	}
	    	
	        return ResponseEntity.ok(response);
    	} catch (Exception e){
    		response.put("result", "Service Error");
			response.put("data", e);
			return ResponseEntity.ok(response);
        }
    }
    
    @PostMapping("/findbyid")
    public ResponseEntity<Map<String, Object>> findByUserID(@RequestBody UserDTO userDTO) {
    
    	try {
    		userDTO = DecryptUser(userDTO);
    		String userID = userDTO.getUserID();
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
    
    public UserDTO DecryptUser(UserDTO userDTO) {
    	
    	try {
	    	Field[] fields = userDTO.getClass().getDeclaredFields(); // 모든 필드를 가져옴
	    	for(Field data : fields) {
	    		data.setAccessible(true); // private 필드에도 접근 가능하게 설정
	    		String value = (String) data.get(userDTO); // 필드의 값 가져오기
	    		if (value != null) {
					value = URLDecoder.decode(value, "UTF-8");
					value = encryptionUtil.AESDecrypt(value);
					data.set(userDTO, value); // 복호화된 값으로 필드 설정
	    		}
			}
    	} catch (Exception e) {
    		return null;
    	}
    	return (UserDTO) userDTO;
    }
}