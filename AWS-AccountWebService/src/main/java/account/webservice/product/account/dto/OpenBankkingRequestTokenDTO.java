package account.webservice.product.account.dto;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class OpenBankkingRequestTokenDTO {

	private String code;
    private String client_id;
    private String client_secret;
    private String redirect_uri;
    private String grant_type;
}