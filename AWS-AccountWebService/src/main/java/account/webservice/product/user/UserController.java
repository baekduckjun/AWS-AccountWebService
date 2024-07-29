package account.webservice.product.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}