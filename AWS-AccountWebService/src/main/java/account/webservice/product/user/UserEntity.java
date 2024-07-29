package account.webservice.product.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "aws_users_tb") //database에 해당 이름의 테이블 생성
@Entity
@Getter
@NoArgsConstructor
public class UserEntity {
    //jpa ==> database를 객체처럼 사용 가능

	@Id
    @Column(name = "userKey", unique = true, nullable = false)
    private String userKey;

    @Column(name = "userID", nullable = false)
    private String userID;

    @Column(name = "userPWD")
    private String userPWD;

    @Column(name = "userName")
    private String userName;
    
    @Column(name = "userEmail")
    private String userEmail;
    
    @Column(name = "userAlias")
    private String userAlias;
    
    @Column(name = "userType")
    private String userType;
    
    @Column(name = "regDate", nullable = false)
    private String regDate;
    
    @Column(name = "isRegAccount")
    private String isRegAccount;

	@Builder
    public UserEntity (String userKey, String userID, String userPWD, String userName, String userEmail, String userAlias, String userType, String regDate, String isRegAccount) {
    	this.userKey = userKey;
    	this.userID = userID;
    	this.userPWD = userPWD;
    	this.userName = userName;
    	this.userEmail = userEmail;
    	this.userAlias = userAlias;
    	this.userType = userType;
    	this.regDate = regDate;
    	this.isRegAccount = isRegAccount;
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