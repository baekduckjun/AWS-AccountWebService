import React, { Component, useState, useEffect } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate } from "react-router-dom";
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

const nextTransition = {
  initial: { opacity: 0, x: 100 },   // 오른쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: -100 },     // 왼쪽으로 나감
};

const backTransition = {
  initial: { opacity: 0, x: -100 },  // 왼쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: 100 },      // 오른쪽으로 나감
};

function CreateUser(props) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("step1");
  const [userData, setUserData] = useState({
    userID: '',
    userPWD: '',
    userPWDConfirm: '',
    userName: '',
    userPhone: '',
    userVerifyPhone: '',
    userEmail: '',
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

  const [preUserID, setPreUserID] = useState('');
  const [isVerifyID, setIsVerifyID] = useState(false);
  const [sendingPhone, setSendingPhone] = useState(false);
  const [checkingVerify, setCheckingVerify] = useState(false);
  const [isVerifyPhone, setIsVerifyPhone] = useState(false);

  const goMain = (e) => {
    e.preventDefault();
    navigate("/", { state: { isBack: true } });
  }

  const goBack = (e) => {
    e.preventDefault();
    setStatus('step1');
  }

  {/* 회원 가입 2SETP 가기 */}
  const goNextStep = (e) => {
    e.preventDefault();

    Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID);
    Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD);
    Validation(validationMessages, setValidationMessages, 'userPWDConfirm', '', userData.userPWD);
    
    if ( !(isVerifyID && preUserID == userData.userID) ) {
      Validation(validationMessages, setValidationMessages, 'userVerifyID', '', userData.userID);
    } else {
      Validation(validationMessages, setValidationMessages, 'userVerifyID', 'available', userData.userID);
    }

    if (userData.userPWD != userData.userPWDConfirm) {
      Validation(validationMessages, setValidationMessages, 'userPWDConfirm', 'notEuqal', userData.userPWD);
    }

    if ( ("" == userData.userID || !(isVerifyID && preUserID == userData.userID) || "" == userData.userPWD) || (userData.userPWD != userData.userPWDConfirm) ) {
      return;
    }

    setSendingPhone(false);
    setStatus('step2');
  }

  const verifyID = async (e) => {
    e.preventDefault();
    setIsVerifyID(false);

    if ("" == userData.userID) {
      Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID);
      return;
    } 

    const EncryptUserID = Cryption('encrypt', userData.userID);
    const requestData = {
      "userID": EncryptUserID
    };

    axios({
      method: "POST",
      url: 'http://localhost:8080/'+process.env.REACT_APP_USER_URL+'/findbyid',
      data: requestData,
      headers: {'Content-type': 'application/json'}
    }).then((res)=>{
      let result = res.data;
      let resultMessage = result.result;
      let resultData = result.data;
      // API로 부터 받은 데이터 출력
      if ( resultMessage != 'Success') {
        if (resultMessage == 'Not Exsits') {
          setIsVerifyID(true);
          setPreUserID(userData.userID);
          Validation(validationMessages, setValidationMessages, 'userVerifyID', 'available', userData.userID);
        } else {
          setIsVerifyID(false);
          alert(resultMessage);
        }
      } else {
        setIsVerifyID(false);
        Validation(validationMessages, setValidationMessages, 'userVerifyID', 'exists', userData.userID);
      }
    }).catch(error=>{
        alert(error);
    });
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
      url: 'http://localhost:8080/'+process.env.REACT_APP_USER_URL+'/findByID',
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
      })
      .catch((error) => {
        setCheckingVerify(false);
        Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone);
        alert("SMS VERIFYPHONE FAILED = "+error);
      });
  };

  const createUserHandleSubmit = async (e) => {
    e.preventDefault();

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

    const requestData = {
      "userID": userData.userID,
      "userPWD": userData.userPWD,
      "userPWDConfirm": userData.userPWDConfirm,
      "userName": userData.userName,
      "userPhone": userData.userPhone,
      "userEmail": userData.userEmail,
      "userAlias": userData.userAlias,
      "userAccountLink": "normal",
    };

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

  if (status == 'step1'){
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
            <div className='title'>회원가입</div>
          </div>
          <div className="logo">
            <img src="/loginLogo.jpg" alt="logo"></img>
          </div>
          <form>
            <div className='input-id'>
              <input
                  type="text"
                  placeholder="✉ 사용자 아이디 또는 이메일 주소"
                  value={userData.userID}
                  onChange={(e) => {
                    setUserData({...userData, userID: e.target.value}); 
                    setIsVerifyID(false);
                    Validation(validationMessages, setValidationMessages, 'userVerifyID', '', userData.userID);
                  }}
                  onBlur={() => Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID)}
              />
              <button type="button" className="verify-button" onClick={verifyID}>인증하기</button>
            </div>
            <div className={(isVerifyID && preUserID == userData.userID) ? 'info-validation' : 'error-validation'}>{validationMessages.userIDValidationMessage}&nbsp;</div>
            <input
                type="password"
                placeholder="비밀번호"
                value={userData.userPWD}
                onChange={(e) => setUserData({...userData, userPWD: e.target.value})}
                onBlur={() => Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD)}
            />
            <div className='error-validation'>{validationMessages.userPWDValidationMessage}&nbsp;</div>
            <input
                type="password"
                placeholder="비밀번호 확인"
                value={userData.userPWDConfirm}
                onChange={(e) => setUserData({...userData, userPWDConfirm: e.target.value})}
                onBlur={() => Validation(validationMessages, setValidationMessages, 'userPWDConfirm', userData.userPWD, userData.userPWDConfirm)}
            />
            <div className='error-validation'>{validationMessages.userPWDConfirmValidationMessage}&nbsp;</div>
            <button className="signup" onClick={goNextStep}>다음 단계 (1/2)</button>
          </form>
        </div>
      </div>
    );
  } else if (status == 'step2'){
    createUserContents.push(
      <div className="createuser_container">
        <div className="container">
          <div className='header'>
            <div className="g_goback">
              <a href="#" onClick={goBack}>
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
            <div className='title'>회원가입</div>
          </div>
          <div className="logo">
            <img src="/loginLogo.jpg" alt="logo"></img>
          </div>
          <form onSubmit={createUserHandleSubmit}>
            <input
              type="text"
              placeholder="이름 입력"
              value={userData.userName}
              onChange={(e) => setUserData({...userData, userName: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userName', '', userData.userName)}
            />
            <div className='error-validation'>{validationMessages.userNameValidationMessage}&nbsp;</div>
            <div className='input-id'>
              { !sendingPhone ? 
                <input
                    type="text"
                    placeholder="전화번호 입력"
                    value={userData.userPhone}
                    onChange={(e) => setUserData({...userData, userPhone: e.target.value})}
                    onBlur={() => Validation(validationMessages, setValidationMessages, 'userPhone', '', userData.userPhone)}
                />
                : 
                <input
                type="text"
                placeholder="인증번호 입력"
                value={userData.userVerifyPhone}
                onChange={(e) => setUserData({...userData, userVerifyPhone: e.target.value})}
                onBlur={() => Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'error', userData.userVerifyPhone)}
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
              placeholder="이메일 주소 입력"
              value={userData.userEmail}
              onChange={(e) => setUserData({...userData, userEmail: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userEmail', '', userData.userEmail)}
            />
            <div className='error-validation'>{validationMessages.userEmailValidationMessage}&nbsp;</div>
            <input
              type="text"
              placeholder="별명 입력"
              value={userData.userAlias}
              onChange={(e) => setUserData({...userData, userAlias: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userAlias', '', userData.userAlias)}
            />
            <div className='error-validation'>{validationMessages.userAliasValidationMessage}&nbsp;</div>
            <button className="signup" type="submit">회원 가입</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'step1' && (
        <motion.div
          key="step1"
          variants={backTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >{createUserContents}</motion.div>
      )};
      {status === 'step2' && (
        <motion.div
          key="step2"
          variants={nextTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >{createUserContents}</motion.div>
      )};
    </AnimatePresence>
  );
}

export default CreateUser;