package account.webservice.product.common.jwt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface JWTRefreshLogRepository extends JpaRepository<JWTRefreshLogEntity, Long> {

}