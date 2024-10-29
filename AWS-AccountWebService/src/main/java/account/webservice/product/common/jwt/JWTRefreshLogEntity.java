package account.webservice.product.common.jwt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "account_users_token_log")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class JWTRefreshLogEntity {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userID")
    private String userID;
    
    @Column(name = "refresh")
    private String refresh;
    
    @Column(name = "expiration")
    private String expiration;
}
