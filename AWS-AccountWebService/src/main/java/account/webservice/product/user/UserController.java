package account.webservice.product.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	Map<String, Object> response = new HashMap<>();
	
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createMember(@RequestBody UserDTO memberDTO) {
    	UserDTO createdMember = userService.createMember(memberDTO);
        
    	response.put("result", "Success");
        response.put("data", createdMember);
    	
        return ResponseEntity.ok(response);
    }
}