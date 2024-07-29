package account.webservice.product.user;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import account.webservice.product.common.util.DateTimeUtil;
import account.webservice.product.common.util.EncryptionUtil;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    private final Logger log = LoggerFactory.getLogger(getClass());
    
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public String createUser(UserDTO userDTO) {
    	/*
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setMemberID(memberDTO.getMemberID());
        memberEntity.setMemberPWD(memberDTO.getMemberPWD());
        memberEntity.setMemberName(memberDTO.getMemberName());
        memberEntity.setMemberEmail(memberDTO.getMemberEmail());
        memberEntity.setMemberType("member");
        memberEntity.setMemberRegDate(DateTimeUtil.getCurrentTimeyymmddhhmmss());
        */
    	
    	if (findByUserID(userDTO.getUserID()) == null) {
	    	EncryptionUtil encrypt = new EncryptionUtil();
	    	String userKey = "";
	    	String encryptUserPWD = "";
	    	String userPWD = userDTO.getUserPWD();
	    	String regDate = DateTimeUtil.getCurrentTimeyymmddhhmmss();
	    	try {
				userKey = encrypt.AESEncrypt(userDTO.getUserID()+regDate);
				encryptUserPWD = encrypt.EncryptSHA256(userPWD);
			} catch (Exception e) {
				log.error("error = {}", e);
			}
	    	
	    	UserEntity userEntity = UserEntity.builder()
	    			.userKey(userKey)
	    			.userID(userDTO.getUserID())
	    			.userPWD(encryptUserPWD)
	    			.userName(userDTO.getUserName())
	    			.userEmail(userDTO.getUserEmail())
	    			.userAlias(userDTO.getUserAlias())
	    			.userType("member")
	    			.regDate(regDate)
	    			.isRegAccount("N")
	    			.build();
	    	
	        UserEntity savedEntity = userRepository.save(userEntity);
	        
	        if (savedEntity != null)
	        	return "Success";
	        else
	        	return "Fail";
    	} else {
    		return "Exists";
    	}
    }

    public UserDTO findByUserID(String userID) {
        Optional<UserEntity> memberEntityOptional = userRepository.findByUserID(userID);
        
        return memberEntityOptional.map(UserDTO::toUserDTO).orElse(null);
    }

    /*
    public UserDTO getMemberById(Long id) {
        Optional<UserEntity> memberEntityOptional = memberRepository.findById(id);
        return memberEntityOptional.map(UserDTO::toMemberDTO).orElse(null);
    }

    public List<UserDTO> getAllMembers() {
        List<UserEntity> memberEntities = memberRepository.findAll();
        return memberEntities.stream()
                             .map(UserDTO::toMemberDTO)
                             .collect(Collectors.toList());
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
    */
}