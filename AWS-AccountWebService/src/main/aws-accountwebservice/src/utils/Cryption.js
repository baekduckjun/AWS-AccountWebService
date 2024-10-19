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

  // AES 복호화 함수
  const decryptText = (text) => {
    const key = getKey(ENCRYPTKEY);
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };

  const processCryption = (data) => {
    const cryptionData = {};
    Object.keys(data).forEach(key => {
      // 객체 내의 문자열 값에 대해서만 암호화/복호화 처리
      if (type === 'urlEncode') {
        cryptionData[key] = encodeURIComponent(value);
      } else if (type === 'urlDecode') {
        cryptionData[key] = decodeURIComponent(value);
      } else if (type === 'encrypt') {
        cryptionData[key] = encodeURIComponent(encryptText(data[key]));
      } else if (type === 'decrypt') {
        const decodedValue = decodeURIComponent(data[key]);
        cryptionData[key] = decryptText(decodedValue);
      }
    });
    return cryptionData;
  };

  if (value != undefined && value !== null) {
    return processCryption(value);
  }

};