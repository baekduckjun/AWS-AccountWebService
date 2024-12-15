package account.webservice.product.account.dto;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OpenBankkingAuthorizeDTO {

    private String code;
    private String scope;
    private String client_info;
    private String state;

	public void setCode(String code) {
		this.code = code;
	}
	
	public void setScope(String scope) {
		this.scope = scope;
	}
	
	public void setClient_info(String client_info) {
		this.client_info = client_info;
	}
	
	public void setState(String state) {
		this.state = state;
	}
	
	public String getCode() {
		return this.code;
	}

	public String getScope() {
		return this.scope;
	}

	public String getClient_info() {
		return this.client_info;
	}

	public String getState() {
		return this.state;
	}
}