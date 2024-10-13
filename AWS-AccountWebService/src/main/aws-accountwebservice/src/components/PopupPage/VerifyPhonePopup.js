import React, { Component, useState, useEffect, useRef } from 'react';
import 'components/PopupPage/VerifyPhonePopup.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_API_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_API_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_API_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_API_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_API_APPID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const firebaseAuth = getAuth(firebaseApp);

function VerifyPhonePopup({ isOpen, onClose, getRef, isVerifyPhonePopupClosing, userData, setUserData, isVerifyPhone, setIsVerifyPhone }) {
  const [timer, setTimer] = useState(180);

  {/** 밸리데이션 **/}
  const [validationMessages, setValidationMessages] = useState({
    userPhoneValidationMessage: '',
    userVerifyPhoneValidationMessage: '',
  });
  {/** 밸리데이션 **/}
  
  let verifyPhonePopupContents = [];

  const [sendingPhone, setSendingPhone] = useState(false);

  const popupRef = useRef(null);
  // 부모 컴포넌트에 popupRef 전달
  useEffect(() => {
    if (getRef) {
      getRef(popupRef.current); // 팝업이 열릴 때만 getRef 호출
    }
  }, [getRef, isOpen]);

  {/** 팝업이 닫힐때 **/}
  const handleClose = () => {
      onClose();
  };
  {/** 팝업이 닫힐때 **/}

  const senddingPhone = async (e) => {
    e.preventDefault();

    {/** 리셋 **/}
    setIsVerifyPhone(false);
    setUserData({...userData, userVerifyPhone: ''});
    {/** 리셋 **/}

    if ("" == userData.userPhone) {
      Validation(validationMessages, setValidationMessages, 'userPhone', '', userData.userPhone);
      return;
    }

    let checkPhone = "+82"+userData.userPhone.substring(1); // +8210-1234-5678

    window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
    
    firebaseAuth.languageCode = "ko";
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(firebaseAuth, checkPhone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;	// window
        setSendingPhone(true);
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'sendding', userData.userPhone);
      })
      .catch((error) => {
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', '',);
        alert("SMS SENDDING FAILED = "+error);
        window.recaptchaVerifier.clear();
      });
    
    const requestData = {
      "userPhone": userData.userPhone
    };

    /*
    axios({
      method: "POST",
      url: process.env.REACT_APP_DOMAIN + process.env.REACT_APP_USER_URL+'/findByID',
      data: requestData,
      // header에서 JSON 타입의 데이터라는 것을 명시
      headers: {'Content-type': 'application/json'}
    }).then((res)=>{
      let result = res.data;
      let resultMessage = result.result;
      let resultData = result.data;
      if ( resultMessage != 'Success') {
        alert(resultMessage);
      } else {
        // API로 부터 받은 데이터 출력
      }
    }).catch(error=>{
        alert(error);
    });
    */
  }

  const verifyPhone = () => {
    const code = userData.userVerifyPhone;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'available', userData.userVerifyPhone);
        setIsVerifyPhone(true);
        onClose();
      })
      .catch((error) => {
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone);
        alert("SMS VERIFYPHONE FAILED = "+error);
      });
  };

  verifyPhonePopupContents.push(
    <div className="verify-phone-popup">
      <div className={`popup-content ${isVerifyPhonePopupClosing ? 'hide' : 'show'}`} ref={popupRef}>
        <div className="header">
          <h2>휴대폰 인증</h2>
        </div>
        <div className="input-phonenumber">
          <input
            type="text"
            placeholder="휴대폰 번호('-' 제외)"
            value={userData.userPhone}
            onChange={(e) => setUserData({...userData, userPhone: e.target.value})}
            onBlur={() => Validation(validationMessages, setValidationMessages, 'userPhone', '', userData.userPhone)}
          />
          <button onClick={senddingPhone} disabled={sendingPhone}>
            인증 번호 전송
          </button>
        </div>
        <div className={sendingPhone ? 'info-validation' : 'error-validation'}>{validationMessages.userPhoneValidationMessage}&nbsp;</div>
        {sendingPhone && (
          <div className='input-verifycode'>
            <input
              type="text"
              placeholder="인증 번호"
              value={userData.userVerifyPhone}
              onChange={(e) => setUserData({...userData, userVerifyPhone: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone)}
            />
            <div className='error-validation'>{validationMessages.userVerifyPhoneValidationMessage}&nbsp;</div>
            <p>남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초</p>
          </div>
        )}
        <div id="recaptcha-container"></div>
        <button onClick={handleClose}>닫기</button>
        <button onClick={verifyPhone} disabled={!sendingPhone}>인증하기</button>
      </div>
    </div>
  );

  return (
    <div>
      {verifyPhonePopupContents}
    </div>
  );
}

export default VerifyPhonePopup;