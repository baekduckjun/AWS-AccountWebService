package account.webservice.product.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "main_member") //database에 해당 이름의 테이블 생성
@Entity
@Getter
@NoArgsConstructor
public class UserEntity {
    //jpa ==> database를 객체처럼 사용 가능

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", unique = true, nullable = false)
    private String memberID;

    @Column(name = "member_pwd", nullable = false)
    private String memberPWD;

    @Column(name = "member_name")
    private String memberName;

    @Column(name = "member_email")
    private String memberEmail;
    
    @Column(name = "member_type")
    private String memberType;
    
    @Column(name = "member_regdate")
    private String memberRegDate;

    @Builder
    public UserEntity (Long id, String memberID, String memberPWD, String memberName, String memberEmail, String memberType, String memberRegDate) {
    	this.id = id;
    	this.memberID = memberID;
    	this.memberPWD = memberPWD;
    	this.memberName = memberName;
    	this.memberEmail = memberEmail;
    	this.memberType = memberType;
    	this.memberRegDate = memberRegDate;
    }
    
	public Long getId() {
		return id;
	}

	public String getMemberID() {
		return memberID;
	}

	public String getMemberPWD() {
		return memberPWD;
	}

	public String getMemberName() {
		return memberName;
	}

	public String getMemberEmail() {
		return memberEmail;
	}

	public String getMemberType() {
		return memberType;
	}

	public String getMemberRegDate() {
		return memberRegDate;
	}
}