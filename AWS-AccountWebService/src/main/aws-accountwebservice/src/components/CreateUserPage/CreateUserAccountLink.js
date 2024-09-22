import React, { Component, useState, useEffect } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

// Firebase 설정 객체 (Firebase Console에서 복사한 설정 값 사용)
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

function CreateUserAccountLink(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAccountData } = location.state || {};
  const [userData, setUserData] = useState({
    userID: userAccountData.userID,
    userPWD: userAccountData.userPWD,
    userPWDConfirm: userAccountData.userPWDConfirm,
    userName: userAccountData.userName,
    userPhone: '',
    userVerifyPhone: '',
    userEmail: userAccountData.userEmail,
    userAlias: ''
  });

  {/** 밸리데이션 **/}
  const [validationMessages, setValidationMessages] = useState({
    userIDValidationMessage: '',
    userPWDValidationMessage: '',
    userPWDConfirmValidationMessage: '',
    userNameValidationMessage: '',
    userPhoneValidationMessage: '',
    userEmailValidationMessage: '',
    userAliasValidationMessage: '',
  });
  {/** 밸리데이션 **/}
  
  let createUserContents = [];

  const [sendingPhone, setSendingPhone] = useState(false);
  const [checkingVerify, setCheckingVerify] = useState(false);
  const [isVerifyPhone, setIsVerifyPhone] = useState(false);

  if (userData.userID == undefined) {
    navigate("/", { state: { isBack: true } });
  }

  const goMain = (e) => {
    e.preventDefault();
    navigate("/", { state: { isBack: true } });
  }

  const senddingPhone = async (e) => {
    e.preventDefault();

    if ("" == userData.userPhone) {
      alert('폰을 입력하세요');
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
        setCheckingVerify(true);
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'sendding');
      })
      .catch((error) => {
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', '');
        alert("SMS SENDDING FAILED = "+error);
        window.recaptchaVerifier.clear();
      });
    
    const requestData = {
      "userPhone": userData.userPhone
    };

    /*
    axios({
      method: "POST",
      url: 'http://localhost:8080/'+process.env.REACT_APP_USER_URL+'/findbyid',
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
    //const code = getCodeFromUserInput();
    const code = userData.userVerifyPhone;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'available', userData.userVerifyPhone);
        setIsVerifyPhone(true);
      })
      .catch((error) => {
        setCheckingVerify(false);
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone);
        alert("SMS VERIFYPHONE FAILED = "+error);
      });
  };

  const createUserHandleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      "userID": userData.userID,
      "userPWD": userData.userPWD,
      "userPWDConfirm": userData.userPWDConfirm,
      "userName": userData.userName,
      "userPhone": userData.userPhone,
      "userEmail": userData.userEmail,
      "userAlias": userData.userAlias,
      "userAccountLink": "google",
    };

    Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID);
    Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD);
    Validation(validationMessages, setValidationMessages, 'userPWDConfirm', '', userData.userPWDConfirm);
    Validation(validationMessages, setValidationMessages, 'userName', '', userData.userName);
    Validation(validationMessages, setValidationMessages, 'userPhone', '', userData.userPhone);
    Validation(validationMessages, setValidationMessages, 'userEmail', '', userData.userEmail);
    Validation(validationMessages ,setValidationMessages, 'userAlias', '', userData.userAlias);

    if (!isVerifyPhone) {
      Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'notVerifyPhone', userData.userPhone);
    } else {
      Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'available', userData.userPhone);
    }

    if ( ("" == userData.userID || "" == userData.userPWD || "" == userData.userPWDConfirm || "" == userData.userName || 
      "" == userData.userPhone || "" == userData.userEmail || "" == userData.userAlias) || !isVerifyPhone) {
        return;
    }

    axios({
      method: "POST",
      url: 'http://localhost:8080/'+process.env.REACT_APP_USER_URL+'/create',
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
        alert("회원가입이 완료되었습니다.\n다시 로그인 해주세요.");
        navigate("/", { state: { isBack: true } });
      }
    }).catch(error=>{
        alert(error);
    });
  }

  createUserContents.push(
    <div className="createuser_container">
      <div className="container">
        <div className='header'>
          <div className="g_goback">
            <a href="#" onClick={goMain}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="goback-icon"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </a>
          </div>
          <div className='title'>추가 정보</div>
        </div>
        <div className="logo">
          <img src="/loginLogo.jpg" alt="logo"></img>
        </div>
        <form onSubmit={createUserHandleSubmit}>
          <div className='input-id'>
            { !sendingPhone ? 
              <input
                  type="text"
                  placeholder="전화번호 입력"
                  value={userData.userPhone}
                  onChange={(e) => setUserData({...userData, userPhone: e.target.value})}
                  onBlur={() => Validation(validationMessages ,setValidationMessages, 'userPhone', '', userData.userPhone)}
              />
              : 
              <input
              type="text"
              placeholder="인증번호 입력"
              value={userData.userVerifyPhone}
              onChange={(e) => setUserData({...userData, userVerifyPhone: e.target.value})}
                onBlur={() => Validation(validationMessages ,setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone)}
            />
              }
              { !sendingPhone ? 
                <button type="button" className="verify-button" onClick={senddingPhone}>전송하기</button> 
              : <button type="button" className="verify-button" onClick={verifyPhone}>인증하기</button>
              }
              <div id="recaptcha-container"></div>
            </div>
            { !isVerifyPhone ? 
              <div className={sendingPhone && checkingVerify ? 'info-validation' : 'error-validation'}>{validationMessages.userPhoneValidationMessage}&nbsp;</div>
            : <div className='info-validation'>{validationMessages.userPhoneValidationMessage}&nbsp;</div>
            }
            <input
              type="text"
              placeholder="별명 입력"
              value={userData.userAlias}
              onChange={(e) => setUserData({...userData, userAlias: e.target.value})}
              onBlur={() => Validation(validationMessages ,setValidationMessages, 'userAlias', '', userData.userAlias)}
            />
            <div className='error-validation'>{validationMessages.userAliasValidationMessage}&nbsp;</div>
            <button className="signup" type="submit">추가 정보</button>
          </form>
        </div>
      </div>
    );

  return (
    <div>
      {createUserContents}
    </div>
  );
}

export default CreateUserAccountLink;