package account.webservice.product.user;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class UserDTO {

    @Id
    private String userKey;
    private String userID;
    private String userPWD;
    private String userName;
    private String userEmail;
    private String userAlias;
    private String userType;
    private String regDate;
    private String isRegAccount;

    // getters and setters
    // constructors
    // other methods
    
	public static UserDTO toUserDTO(UserEntity userEntity){
    	UserDTO userDTO = new UserDTO();
    	userDTO.setUserKey(userEntity.getUserKey());
    	userDTO.setUserID(userEntity.getUserID());
    	userDTO.setUserPWD(userEntity.getUserPWD());
    	userDTO.setUserName(userEntity.getUserName());
    	userDTO.setUserEmail(userEntity.getUserEmail());
    	userDTO.setUserAlias(userEntity.getUserAlias());
    	userDTO.setUserType(userEntity.getUserType());
    	userDTO.setRegDate(userEntity.getRegDate());
    	userDTO.setIsRegAccount(userEntity.getIsRegAccount());

        return userDTO;
    }

	private void setUserKey(String userKey) {
		this.userKey = userKey;
	}
	
	public String getUserKey() {
		return this.userKey;
	}

	public String getUserID() {
		return this.userID;
	}

	public String getUserPWD() {
		return this.userPWD;
	}

	public String getUserName() {
		return this.userName;
	}

	public String getUserEmail() {
		return this.userEmail;
	}

	public String getUserAlias(String userAlias) {
		return this.userAlias;
	}

	public String getUserType() {
		return this.userType;
	}

	public String getRegDate() {
		return this.regDate;
	}

	public String getIsRegAccount() {
		return this.isRegAccount;
	}
}