package account.webservice.product.common.util;

import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.regex.Pattern;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import account.webservice.product.account.dto.AccountDTO;
import account.webservice.product.account.dto.OpenBankkingAuthorizeDTO;
import account.webservice.product.user.UserDTO;

@Component
public class EncryptionUtil implements PasswordEncoder{

	@Value("${SPRING.APP.API.ENCRYPTKEY}")
	private String ENCRYPTKEY;
	
	public EncryptionUtil() {
	}
	
	public String EncryptSHA256(String inputStr) {
    	String encryptStr = inputStr+ENCRYPTKEY;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(encryptStr.getBytes());

            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    /*
    public SecretKey createSecretKey() {
        byte[] keyBytes = ENCRYPTKEY.getBytes();
        // 키 길이는 128비트(16바이트), 192비트(24바이트) 또는 256비트(32바이트)여야 합니다.
        byte[] keyBytesPadded = new byte[16]; // 16바이트(128비트)로 패딩
        System.arraycopy(keyBytes, 0, keyBytesPadded, 0, Math.min(keyBytes.length, keyBytesPadded.length));

        return new SecretKeySpec(keyBytesPadded, "AES");
    }
    */
    
    public String AESEncrypt(String inputStr) throws Exception {
		SecretKeySpec secretKey = new SecretKeySpec(ENCRYPTKEY.getBytes("UTF-8"), "AES");
	    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
	    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
	    return Base64.getEncoder().encodeToString(cipher.doFinal(inputStr.getBytes("UTF-8")));
    }

    public String AESDecrypt(String inputStr) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(ENCRYPTKEY.getBytes("UTF-8"), "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decodedBytes = Base64.getDecoder().decode(inputStr);
        return new String(cipher.doFinal(decodedBytes), "UTF-8");
    }

    //jwt 관련하여 암호화 함수
	@Override
	public String encode(CharSequence rawPassword) {
		String inputStr = rawPassword.toString();
		return EncryptSHA256(inputStr);
	}

	//jwt 관련하여 암호화 함수
	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		if (rawPassword == null) {
			throw new IllegalArgumentException("rawPassword cannot be null");
		}
		if (encodedPassword == null || encodedPassword.length() == 0) {
			return false;
		}
		return rawPassword.equals(encodedPassword);
	}
	
	
	public UserDTO EncryptUser(UserDTO userDTO, String EX) {
    	try {
	    	Field[] fields = userDTO.getClass().getDeclaredFields(); // 모든 필드를 가져옴
	    	for(Field data : fields) {
	    		data.setAccessible(true); // private 필드에도 접근 가능하게 설정
	    		String value = (String) data.get(userDTO); // 필드의 값 가져오기
	    		String key = (String) data.getName();
	    		if (value != null) {
	    			if ( (EX.equals(key)) ) {
	    				//해당 필드는 제거
	    				data.set(userDTO, null);
	    			} else {
	    				value = AESEncrypt(value);
						value = URLEncoder.encode(value, "UTF-8");
						data.set(userDTO, value); // 복호화된 값으로 필드 설정
	    			}
	    		}
			}
    	} catch (Exception e) {
    		return null;
    	}
    	return (UserDTO) userDTO;
    }
	
	public UserDTO DecryptUser(UserDTO userDTO) {
    	try {
	    	Field[] fields = userDTO.getClass().getDeclaredFields(); // 모든 필드를 가져옴
	    	for(Field data : fields) {
	    		data.setAccessible(true); // private 필드에도 접근 가능하게 설정
	    		String value = (String) data.get(userDTO); // 필드의 값 가져오기
	    		if (value != null) {
					value = URLDecoder.decode(value, "UTF-8");
					value = AESDecrypt(value);
					data.set(userDTO, value); // 복호화된 값으로 필드 설정
	    		}
			}
    	} catch (Exception e) {
    		return null;
    	}
    	return (UserDTO) userDTO;
    }
	
	public AccountDTO EncryptAccount(AccountDTO accountDTO, String EX) {
    	try {
	    	Field[] fields = accountDTO.getClass().getDeclaredFields(); // 모든 필드를 가져옴
	    	for(Field data : fields) {
	    		data.setAccessible(true); // private 필드에도 접근 가능하게 설정
	    		String value = (String) data.get(accountDTO); // 필드의 값 가져오기
	    		String key = (String) data.getName();
	    		if (value != null) {
	    			if ( (EX.equals(key)) ) {
	    				//해당 필드는 제거
	    				data.set(accountDTO, null);
	    			} else {
	    				value = AESEncrypt(value);
						value = URLEncoder.encode(value, "UTF-8");
						data.set(accountDTO, value); // 복호화된 값으로 필드 설정
	    			}
	    		}
			}
    	} catch (Exception e) {
    		return null;
    	}
    	return (AccountDTO) accountDTO;
    }
	
	public AccountDTO DecryptAccount(AccountDTO accountDTO) {
    	try {
	    	Field[] fields = accountDTO.getClass().getDeclaredFields(); // 모든 필드를 가져옴
	    	for(Field data : fields) {
	    		data.setAccessible(true); // private 필드에도 접근 가능하게 설정
	    		String value = (String) data.get(accountDTO); // 필드의 값 가져오기
	    		if (value != null) {
					value = URLDecoder.decode(value, "UTF-8");
					value = AESDecrypt(value);
					data.set(accountDTO, value); // 복호화된 값으로 필드 설정
	    		}
			}
    	} catch (Exception e) {
    		return null;
    	}
    	return (AccountDTO) accountDTO;
    }
}