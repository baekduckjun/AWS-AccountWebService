import React, { Component, useState, useEffect } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { validation } from 'Utile'; // utile.js 파일을 가져옴
import { EncryptionUtil } from 'Utile'; // utile.js 파일을 가져옴

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
  const [userID, setUserID] = useState('');
  const [userPWD, setUserPWD] = useState('');
  const [userPWDConfirm, setUserPWDConfirm] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userVerifyPhone, setUserVerifyPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAlias, setUserAlias] = useState('');

  {/** 밸리데이션 **/}
  const [userIDErrorMessage, setUserIDErrorMessage] = useState('');
  const [userPWDErrorMessage, setUserPWDErrorMessage] = useState('');
  const [userPWDConfirmErrorMessage, setUserPWDConfirmErrorMessage] = useState('');
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [userPhoneErrorMessage, setUserPhoneErrorMessage] = useState('');
  const [userEmailErrorMessage, setUserEmailErrorMessage] = useState('');
  const [userAliasErrorMessage, setUserAliasErrorMessage] = useState('');
  {/** 밸리데이션 **/}
  
  let createUserContents = [];
  let userURL = "api/v1/user";

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
    if ("" == userID) {
      validation('id', '', userID, setUserIDErrorMessage)
      return;
    }
    if (!isVerifyID) {
      validation('verifyID', '', userID, setUserIDErrorMessage)
      return;
    }
    if ("" == userPWD) {
      validation('pwd', '', userPWD, setUserPWDErrorMessage)
      return;
    }
    if ("" == userPWDConfirm) {
      validation('pwdConfirm', '', '', setUserPWDConfirmErrorMessage)
      return;
    }
    if (userPWD != userPWDConfirm) {
      validation('pwdConfirm', '', 'notEuqal', setUserPWDConfirmErrorMessage)
      return;
    }
    setSendingPhone(false);
    setStatus('step2');
  }

  const verifyID = async (e) => {
    e.preventDefault();
    setIsVerifyID(false);

    if ("" == userID) {
      validation('id', '', userID, setUserIDErrorMessage)
      return;
    } 

    const EncryptUserID = EncryptionUtil('encrypt', userID);
    const requestData = {
      "userID": EncryptUserID
    };

    axios({
      method: "POST",
      url: 'http://localhost:8080/'+userURL+'/findbyid',
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
          validation('verifyID', 'available', userID, setUserIDErrorMessage);
        } else {
          setIsVerifyID(false);
          alert(resultMessage);
        }
      } else {
        setIsVerifyID(false);
        validation('verifyID', 'exists', userID, setUserIDErrorMessage);
      }
    }).catch(error=>{
        alert(error);
    });
  }

  const senddingPhone = async (e) => {
    e.preventDefault();

    if ("" == userPhone) {
      alert('폰을 입력하세요');
      return;
    }

    let checkPhone = "+82"+userPhone.substring(1); // +8210-1234-5678

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
        validation('verifyPhone', 'sendding', userPhone, setUserPhoneErrorMessage);
      })
      .catch((error) => {
        validation('verifyPhone', 'error', '', setUserPhoneErrorMessage);
        alert("SMS SENDDING FAILED = "+error);
        window.recaptchaVerifier.clear();
      });
    
    const requestData = {
      "userPhone": userPhone
    };

    /*
    axios({
      method: "POST",
      url: 'http://localhost:8080/'+userURL+'/findByID',
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
    const code = userVerifyPhone;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        validation('verifyPhone', 'available', userVerifyPhone, setUserPhoneErrorMessage);
        setIsVerifyPhone(true);
      })
      .catch((error) => {
        setCheckingVerify(false);
        validation('verifyPhone', 'error', userVerifyPhone, setUserPhoneErrorMessage);
        alert("SMS VERIFYPHONE FAILED = "+error);
      });
  };

  const createUserHandleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      "userID": userID,
      "userPWD": userPWD,
      "userPWDConfirm": userPWDConfirm,
      "userName": userName,
      "userPhone": userPhone,
      "userEmail": userEmail,
      "userAlias": userAlias
    };

    if ("" == userID) {
      validation('id', '', userID, setUserIDErrorMessage)
      return;
    } 
    if ("" == userPWD) {
      validation('pwd', '', userPWD, setUserPWDErrorMessage)
      return;
    } 
    if ("" == userPWDConfirm) {
      validation('pwdConfirm', '', userPWDConfirm, setUserPWDConfirmErrorMessage)
    }
    if ("" == userName) {
      validation('name', '', userName, setUserNameErrorMessage)
      return;
    }
    if ("" == userPhone) {
      validation('phone', '', userPhone, setUserPhoneErrorMessage)
      return;
    }
    if (!isVerifyPhone) {
      validation('verifyPhone', 'notVerifyPhone', userPhone, setUserPhoneErrorMessage)
      return;
    }
    if ("" == userEmail) {
      validation('email', '', userEmail, setUserEmailErrorMessage)
      return;
    }
    if ("" == userAlias) {
      validation('alias', '', userAlias, setUserAliasErrorMessage)
      return;
    } 

    axios({
      method: "POST",
      url: 'http://localhost:8080/'+userURL+'/create',
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
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  onBlur={() => validation('id', '', userID, setUserIDErrorMessage)}
              />
              <button type="button" className="verify-button" onClick={verifyID}>인증하기</button>
            </div>
            <div className={isVerifyID ? 'info-validation' : 'error-validation'}>{userIDErrorMessage}&nbsp;</div>
            <input
                type="password"
                placeholder="비밀번호"
                value={userPWD}
                onChange={(e) => setUserPWD(e.target.value)}
                onBlur={() => validation('pwd', '', userPWD, setUserPWDErrorMessage)}
            />
            <div className='error-validation'>{userPWDErrorMessage}&nbsp;</div>
            <input
                type="password"
                placeholder="비밀번호 확인"
                value={userPWDConfirm}
                onChange={(e) => setUserPWDConfirm(e.target.value)}
                onBlur={() => validation('pwdConfirm', userPWD, userPWDConfirm, setUserPWDConfirmErrorMessage)}
            />
            <div className='error-validation'>{userPWDConfirmErrorMessage}&nbsp;</div>
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => validation('name', '', userName, setUserNameErrorMessage)}
            />
            <div className='error-validation'>{userNameErrorMessage}&nbsp;</div>
            <div className='input-id'>
              { !sendingPhone ? 
                <input
                    type="text"
                    placeholder="전화번호 입력"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    onBlur={() => validation('phone', '', userPhone, setUserPhoneErrorMessage)}
                />
                : 
                <input
                type="text"
                placeholder="인증번호 입력"
                value={userVerifyPhone}
                onChange={(e) => setUserVerifyPhone(e.target.value)}
                onBlur={() => validation('verifyPhone', 'error', userVerifyPhone, setUserPhoneErrorMessage)}
            />
              }
              { !sendingPhone ? 
                <button type="button" className="verify-button" onClick={senddingPhone}>전송하기</button> 
              : <button type="button" className="verify-button" onClick={verifyPhone}>인증하기</button>
              }
              <div id="recaptcha-container"></div>
            </div>
            { !isVerifyPhone ? 
              <div className={sendingPhone && checkingVerify ? 'info-validation' : 'error-validation'}>{userPhoneErrorMessage}&nbsp;</div>
            : <div className='info-validation'>{userPhoneErrorMessage}&nbsp;</div>
            }
            <input
              type="text"
              placeholder="이메일 주소 입력"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onBlur={() => validation('email', '', userEmail, setUserEmailErrorMessage)}
            />
            <div className='error-validation'>{userEmailErrorMessage}&nbsp;</div>
            <input
              type="text"
              placeholder="별명 입력"
              value={userAlias}
              onChange={(e) => setUserAlias(e.target.value)}
              onBlur={() => validation('alias', '', userAlias, setUserAliasErrorMessage)}
            />
            <div className='error-validation'>{userAliasErrorMessage}&nbsp;</div>
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