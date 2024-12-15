package account.webservice.product.user;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import account.webservice.product.common.jwt.CustomUserDetails;
import account.webservice.product.common.util.DateTimeUtil;
import account.webservice.product.common.util.EncryptionUtil;

@Service
public class UserServiceImpl implements UserService, UserDetailsService{

    @Autowired
    private UserRepository userRepository;
    private final EncryptionUtil encryptionUtil;
    private final Logger log = LoggerFactory.getLogger(getClass());
    
    public UserServiceImpl(UserRepository userRepository, EncryptionUtil encryptionUtil) {
        this.userRepository = userRepository;
        this.encryptionUtil = encryptionUtil;
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
	    	String userKey = "";
	    	String encryptUserPWD = "";
	    	String userPWD = userDTO.getUserPWD();
	    	String regDate = DateTimeUtil.getCurrentTimeyymmddhhmmss();
	    	try {
				userKey = encryptionUtil.AESEncrypt(userDTO.getUserID()+regDate);
				encryptUserPWD = encryptionUtil.EncryptSHA256(userPWD);
			} catch (Exception e) {
				log.error("error = {}", e);
			}
	    	
	    	UserEntity savedEntity = null;
	    	if ("normal".equals(userDTO.getUserAccountLink())) {
	    		UserEntity userEntity = UserEntity.builder()
		    			.userKey(userKey)
		    			.userID(userDTO.getUserID())
		    			.userPWD(encryptUserPWD)
		    			.userName(userDTO.getUserName())
		    			.userEmail(userDTO.getUserEmail())
		    			.userAlias(userDTO.getUserAlias())
		    			.userType("member")
		    			.regDate(regDate)
		    			.userAccountLink("normal")
		    			.isRegAccount("N")
		    			.build();
		    	
		        savedEntity = userRepository.save(userEntity);
	    		
	    	} else if ("google".equals(userDTO.getUserAccountLink())) {
	    		UserEntity userEntity = UserEntity.builder()
		    			.userKey(userKey)
		    			.userID(userDTO.getUserID())
		    			.userPWD(encryptUserPWD)
		    			.userName(userDTO.getUserName())
		    			.userEmail(userDTO.getUserEmail())
		    			.userAlias(userDTO.getUserAlias())
		    			.userType("member")
		    			.regDate(regDate)
		    			.userAccountLink("google")
		    			.isRegAccount("N")
		    			.build();
		    	
		        savedEntity = userRepository.save(userEntity);
	    	}
	    	
	        
	        if (savedEntity != null)
	        	return "Success";
	        else
	        	return "Fail";
    	} else {
    		return "Exists";
    	}
    }

    @Override
    public UserDTO findByUserID(String userID) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUserID(userID);
        
        return userEntityOptional.map(UserDTO::toUserDTO).orElse(null);
    }

	@Override
	public UserDTO doLogin(UserDTO userDTO) {
		String userID = userDTO.getUserID();
		Optional<UserEntity> userEntityOptional = userRepository.findByUserID(userID);
	        
        return userEntityOptional.map(UserDTO::toUserDTO).orElse(null);
	}

	//jwt 인증 로그인
	@Override
	public UserDetails loadUserByUsername(String userID) throws UsernameNotFoundException {
		
		Optional<UserEntity> userData = userRepository.findByUserID(userID);

        if (userData != null) {
			//UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomUserDetails(userData.get());
        }

		return null;
	}
	
	@Override
    public String accountSign(String userID) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUserID(userID);
        
        UserDTO userDTO = userEntityOptional.map(UserDTO::toUserDTO).orElse(null);
        UserEntity userEntity = UserEntity.builder()
    			.userKey(userDTO.getUserKey())
    			.userID(userDTO.getUserID())
    			.userPWD(userDTO.getUserPWD())
    			.userName(userDTO.getUserName())
    			.userEmail(userDTO.getUserEmail())
    			.userAlias(userDTO.getUserAlias())
    			.userType(userDTO.getUserType())
    			.regDate(userDTO.getRegDate())
    			.userAccountLink(userDTO.getUserAccountLink())
    			.isRegAccount("Y")
    			.build();
        
        UserEntity savedEntity = null;
        savedEntity = userRepository.save(userEntity);
        
        if (savedEntity != null)
        	return "Success";
        else
        	return "Fail";
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