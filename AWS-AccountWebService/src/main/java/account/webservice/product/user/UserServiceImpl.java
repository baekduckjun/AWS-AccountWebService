package account.webservice.product.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import account.webservice.product.common.util.DateTimeUtil;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDTO createMember(UserDTO memberDTO) {
    	/*
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setMemberID(memberDTO.getMemberID());
        memberEntity.setMemberPWD(memberDTO.getMemberPWD());
        memberEntity.setMemberName(memberDTO.getMemberName());
        memberEntity.setMemberEmail(memberDTO.getMemberEmail());
        memberEntity.setMemberType("member");
        memberEntity.setMemberRegDate(DateTimeUtil.getCurrentTimeyymmddhhmmss());
        */
    	
    	UserEntity memberEntity = UserEntity.builder()
    			.memberID(memberDTO.getMemberID())
    			.memberPWD(memberDTO.getMemberPWD())
    			.memberName(memberDTO.getMemberName())
    			.memberEmail(memberDTO.getMemberEmail())
    			.memberType("member")
    			.memberRegDate(DateTimeUtil.getCurrentTimeyymmddhhmmss())
    			.build();
    	
        UserEntity savedEntity = userRepository.save(memberEntity);
        return UserDTO.toMemberDTO(savedEntity);
    }
    /*
    public UserDTO findByMemberID(String memberID) {
        Optional<UserEntity> memberEntityOptional = memberRepository.findByMemberID(memberID);
        
        return memberEntityOptional.map(UserDTO::toMemberDTO).orElse(null);
    }

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