package account.webservice.product.account.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import account.webservice.product.account.AccountEntity;
import account.webservice.product.account.AccountRepository;
import account.webservice.product.account.dto.AccountDTO;
import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;
import account.webservice.product.account.service.AccountService;
import account.webservice.product.common.jwt.CustomUserDetails;
import account.webservice.product.common.util.DateTimeUtil;
import account.webservice.product.common.util.EncryptionUtil;
import account.webservice.product.user.UserDTO;
import account.webservice.product.user.UserEntity;
import account.webservice.product.user.UserService;

@Service
public class AccountServiceImpl implements AccountService{

    @Autowired
    private UserService userService;
    private AccountRepository accountRepository;
    private final EncryptionUtil encryptionUtil;
    private final Logger log = LoggerFactory.getLogger(getClass());
    
    public AccountServiceImpl(UserService userService, AccountRepository accountRepository, EncryptionUtil encryptionUtil) {
    	this.userService = userService;
        this.accountRepository = accountRepository;
        this.encryptionUtil = encryptionUtil;
    }
    
    @Override
    public String signAccount(AccountDTO accountDTO) {
    	
    	if (findByAccountNumber(accountDTO) == null) {
	    	String accountKey = "";
	    	String encryptUserPWD = "";
	    	String regDate = DateTimeUtil.getCurrentTimeyymmddhhmmss();
	    	try {
	    		accountKey = encryptionUtil.AESEncrypt(accountDTO.getAccountNumber()+regDate);
			} catch (Exception e) {
				log.error("error = {}", e);
			}
	    	
	    	AccountEntity savedEntity = null;
	    	if ("004".equals(accountDTO.getAccountCode())) {
	    		AccountEntity accountEntity = AccountEntity.builder()
		    			.accountKey(accountKey)
		    			.userID(accountDTO.getUserID())
		    			.accountCode(accountDTO.getAccountCode())
		    			.accountName("국민")
		    			.accountNumber(accountDTO.getAccountNumber())
		    			.accountAlias(accountDTO.getAccountAlias())
		    			.regDate(regDate)
		    			.build();
		    	
		        savedEntity = accountRepository.save(accountEntity);
	    		
	    	} else if ("092".equals(accountDTO.getAccountCode())) {
	    		AccountEntity accountEntity = AccountEntity.builder()
	    				.accountKey(accountKey)
		    			.userID(accountDTO.getUserID())
		    			.accountCode(accountDTO.getAccountCode())
		    			.accountName("토스")
		    			.accountNumber(accountDTO.getAccountNumber())
		    			.accountAlias(accountDTO.getAccountAlias())
		    			.regDate(regDate)
		    			.build();
		    	
		        savedEntity = accountRepository.save(accountEntity);
	    	}
	    	
	        
	        if (savedEntity != null) {
	        	return userService.accountSign(accountDTO.getUserID());
	        } else
	        	return "Fail";
    	} else {
    		return "Exists";
    	}
    }
    
    @Override
    public AccountDTO findByAccountNumber(AccountDTO accountDTO) {
		String userID = accountDTO.getUserID();
		String accountNumber = accountDTO.getAccountNumber();
		Optional<AccountEntity> accountEntityOptional = accountRepository.findByAccountNumber(userID, accountNumber);
	        
        return accountEntityOptional.map(AccountDTO::toAccountDTO).orElse(null);
    }
}