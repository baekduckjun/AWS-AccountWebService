package account.webservice.product.user;

import java.util.Optional;

public interface UserService {
	 public String createUser(UserDTO userDTO);
	 public UserDTO findByUserID(String userID);
	 public UserDTO doLogin(UserDTO userDTO);
}
