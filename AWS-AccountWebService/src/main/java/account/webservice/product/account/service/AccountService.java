package account.webservice.product.account.service;

import java.util.Optional;

import account.webservice.product.account.dto.AccountDTO;
import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;

public interface AccountService {
	 public String signAccount(AccountDTO accountDTO);
	 public AccountDTO findByAccountNumber(AccountDTO accountDTO);
}
