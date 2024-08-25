package account.webservice.product.common.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "SPRING.APP.API")
public class EncryptionUtil {

	private String ENCRYPTKEY;
	//private final SecretKey secretKey = createSecretKey();
	
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
}