package account.webservice.product.user;

public interface UserService {
	 public String createUser(UserDTO userDTO);
	 public UserDTO findByUserID(String userID);
}
