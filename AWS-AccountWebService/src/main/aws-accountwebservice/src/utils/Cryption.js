import CryptoJS from 'crypto-js';

export const Cryption = (type, value) => {
  const ENCRYPTKEY=process.env.REACT_APP_API_ENCRYPTKEY;
  
  // 비밀 키를 생성하는 함수
  const getKey = (key) => {
    // 키를 128비트(16바이트)로 패딩
    return CryptoJS.enc.Utf8.parse(key.padEnd(16, ' '));
  };

  // AES 암호화 함수
  const encryptText = (text) => {
    const key = getKey(ENCRYPTKEY);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  };

  // URL 인코딩 함수
  const urlEncode = (text) => {
    return encodeURIComponent(text);
  };

  // AES 복호화 함수
  const decryptText = (text) => {
    const key = getKey(ENCRYPTKEY);
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };

  // URL 디코딩 함수
  const urlDecode = (text) => {
    return decodeURIComponent(text);
  };

  if (type === 'urlEncode') {
    // URL 인코딩
    if (value.trim() === "") {
      return null;
    }
    return urlEncode(value);

  } else if (type === 'encrypt') {
    // AES 암호화
    if (value.trim() === "") {
      return null;
    }
    const Encrypt = encryptText(value, ENCRYPTKEY)
    return urlEncode(Encrypt);
  } else if (type === 'decrypt') {
    // AES 복호화
    if (value.trim() === "") {
      return null;
    }
    const decryptedValue = urlDecode(decryptedValue)
    return decryptText(decryptedValue, ENCRYPTKEY); // 복호화 후 URL 디코딩
  } else {
    return null;
  }

};