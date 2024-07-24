package account.webservice.product.user;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class UserDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String memberID;
    private String memberPWD;
    private String memberName;
    private String memberEmail;
    private String memberType;
    private String memberRegDate;

    // getters and setters
    // constructors
    // other methods
    
	public static UserDTO toMemberDTO(UserEntity memberEntity){
    	UserDTO memberDTO = new UserDTO();
    	memberDTO.setId(memberEntity.getId());
        memberDTO.setMemberID(memberEntity.getMemberID());
        memberDTO.setMemberPWD(memberEntity.getMemberPWD());
        memberDTO.setMemberName(memberEntity.getMemberName());
        memberDTO.setMemberEmail(memberEntity.getMemberEmail());
        memberDTO.setMemberType(memberEntity.getMemberType());
        memberDTO.setMemberRegDate(memberEntity.getMemberRegDate());

        return memberDTO;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMemberID() {
		return memberID;
	}

	public void setMemberID(String memberID) {
		this.memberID = memberID;
	}

	public String getMemberPWD() {
		return memberPWD;
	}

	public void setMemberPWD(String memberPWD) {
		this.memberPWD = memberPWD;
	}

	public String getMemberName() {
		return memberName;
	}

	public void setMemberName(String memberName) {
		this.memberName = memberName;
	}

	public String getMemberEmail() {
		return memberEmail;
	}

	public void setMemberEmail(String memberEmail) {
		this.memberEmail = memberEmail;
	}
	
	public String getMemberType() {
		return memberType;
	}

	public void setMemberType(String memberType) {
		this.memberType = memberType;
	}
	
	public String getMemberRegDate() {
		return memberRegDate;
	}

	public void setMemberRegDate(String memberRegDate) {
		this.memberRegDate = memberRegDate;
	}

}