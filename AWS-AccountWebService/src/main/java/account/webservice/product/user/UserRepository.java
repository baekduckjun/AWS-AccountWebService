package account.webservice.product.user;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    // 필요한 경우 추가 쿼리 메서드를 여기에 정의할 수 있습니다.
	
	@Query(value = "SELECT * FROM aws_users_tb WHERE userID = ?1", nativeQuery = true)
	Optional<UserEntity> findByUserID(String userID);
	
}