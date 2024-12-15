package account.webservice.product.account.service;

import java.util.Optional;

import org.springframework.http.ResponseEntity;

import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;
import account.webservice.product.account.dto.OpenBankkingResponseTokenDTO;

public interface OpenBankkingRestTemplateService {
	 public ResponseEntity<OpenBankkingResponseTokenDTO> getTokenAPI(OpenBankkingAuthorizeDTO openBankkingAuthorizeDTO);
	 public ResponseEntity<OpenBankkingResponseTokenDTO> getAccountInfoAPI(OpenBankkingAuthorizeDTO openBankkingAuthorizeDTO);
}
