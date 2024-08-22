package account.webservice.product.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import account.webservice.product.common.util.EncryptionUtil;

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
}