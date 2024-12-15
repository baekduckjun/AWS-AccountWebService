package account.webservice.product.account;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, String> {
    // 필요한 경우 추가 쿼리 메서드를 여기에 정의할 수 있습니다.
	
	@Query(value = "SELECT * FROM aws_account_tb WHERE userID = ?1 and accountNumber = ?2", nativeQuery = true)
	Optional<AccountEntity> findByAccountNumber(String userID, String accountNumber);
}