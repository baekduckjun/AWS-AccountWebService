package account.webservice.product.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "aws_account_tb") //database에 해당 이름의 테이블 생성
@Entity
@Getter
@NoArgsConstructor
public class AccountEntity {
    //jpa ==> database를 객체처럼 사용 가능

	@Id
    @Column(name = "accountKey", unique = true, nullable = false)
    private String accountKey;

    @Column(name = "userID", nullable = false)
    private String userID;

    @Column(name = "accountCode")
    private String accountCode;
    
    @Column(name = "accountName")
    private String accountName;

    @Column(name = "accountNumber")
    private String accountNumber;
    
    @Column(name = "accountAlias")
    private String accountAlias;
    
    @Column(name = "regDate")
    private String regDate;
    
	@Builder
    public AccountEntity (String accountKey, String userID, String accountCode, String accountName, String accountNumber, String accountAlias, String regDate) {
    	this.accountKey = accountKey;
    	this.userID = userID;
    	this.accountName = accountName;
    	this.accountCode = accountCode;
    	this.accountNumber = accountNumber;
    	this.accountAlias = accountAlias;
    	this.regDate = regDate;
    }
}