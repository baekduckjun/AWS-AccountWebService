package account.webservice.product.account.dto;


import account.webservice.product.account.AccountEntity;
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
public class AccountDTO {

    @Id
    private String accountKey;
    private String userID;
    private String accountCode;
    private String accountName;
    private String accountNumber;
    private String accountAlias;
    private String regDate;

    // getters and setters
    // constructors
    // other methods
    
	public static AccountDTO toAccountDTO(AccountEntity accountEntity){
    	AccountDTO accountDTO = new AccountDTO();
    	accountDTO.setAccountKey(accountEntity.getAccountKey());
    	accountDTO.setUserID(accountEntity.getUserID());
    	accountDTO.setAccountCode(accountEntity.getAccountCode());
    	accountDTO.setAccountName(accountEntity.getAccountName());
    	accountDTO.setAccountNumber(accountEntity.getAccountNumber());
    	accountDTO.setAccountAlias(accountEntity.getAccountAlias());
    	accountDTO.setRegDate(accountEntity.getRegDate());

        return accountDTO;
    }
}