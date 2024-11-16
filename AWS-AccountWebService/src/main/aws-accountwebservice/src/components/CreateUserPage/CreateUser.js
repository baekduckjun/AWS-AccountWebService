import React, { Component, useState, useEffect, useRef } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import VerifyPhonePopup from 'components/PopupPage/VerifyPhonePopup';

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

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
  const [isVerifyID, setIsVerifyID] = useState('');
  const [isVerifyPhone, setIsVerifyPhone] = useState(false);

  const goMain = (e) => {
    e.preventDefault();
    navigate("/", { state: { isBack: true } });
  }

  const goBack = (e) => {
    e.preventDefault();
    setStatus('step1');
  }

  {/** 휴대폰 인증 팝업 **/}
  const [isVerifyPhonePopupOpen, setIsVerifyPhonePopupOpen] = useState(false);      // 팝업 실행 유무
  const [isVerifyPhonePopupClosing, setIsVerifyPhonePopupClosing] = useState(false);// 팝업이 닫힐 시 애니메이션을 위한 먼저 true

  const verifyPhonePopupOpen = () => {
    setIsVerifyPhonePopupOpen(true);
    setIsVerifyPhonePopupClosing(false);
  };

  const verifyPhonePopupClose = () => {
    setIsVerifyPhonePopupClosing(true); // 팝업이 닫힐 시 애니메이션 실행 하기위한 먼저 true 
    setTimeout(() => {
      setIsVerifyPhonePopupOpen(false); // 애니메이션 후 팝업 닫기
    }, 300); // 애니메이션 시간
  };

  const popupRef = useRef(null);
  const getPopupRef = (ref) => {
    if (ref) {
      popupRef.current = ref; // ref가 유효할 때만 설정
    }
  };

  useEffect(() => {
    // 팝업 외부 클릭 감지 함수
    const verifyPhonePopupOutSideClick = (event) => {
      if (isVerifyPhonePopupOpen && popupRef.current && !popupRef.current.contains(event.target)) {
        verifyPhonePopupClose();
      }
    };
    
    if (isVerifyPhonePopupOpen){
      document.body.classList.remove('scrollHidden');
      // 클릭 이벤트 리스너 추가
      document.addEventListener("mousedown", verifyPhonePopupOutSideClick);
    }else{
      document.body.classList.add('scrollHidden');
      document.removeEventListener('mousedown', verifyPhonePopupOutSideClick);
    }

    if (isVerifyPhone) {
      Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'available', userData.userPhone);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", verifyPhonePopupOutSideClick);
    };
  }, [isVerifyPhonePopupOpen]);
  {/** 휴대폰 인증 팝업 **/}

  {/* 회원 가입 2SETP 가기 */}
  const goNextStep = (e) => {
    e.preventDefault();

    Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID);
    Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD);
    Validation(validationMessages, setValidationMessages, 'userPWDConfirm', '', userData.userPWD);
    
    if ("" != userData.userID) {
      if ( !(isVerifyID && preUserID == userData.userID) ) {
        Validation(validationMessages, setValidationMessages, 'userVerifyID', 'needVerifyID', userData.userID);
      } else {
        Validation(validationMessages, setValidationMessages, 'userVerifyID', 'available', userData.userID);
      }
    }

    if (userData.userPWD != userData.userPWDConfirm) {
      Validation(validationMessages, setValidationMessages, 'userPWDConfirm', 'notEuqal', userData.userPWD);
    }

    if ( ("" == userData.userID || !(isVerifyID && preUserID == userData.userID) || "" == userData.userPWD) || (userData.userPWD != userData.userPWDConfirm) ) {
      return;
    }

    setStatus('step2');
  }

  const verifyID = async (e) => {
    e.preventDefault();
    setIsVerifyID(false);

    if ("" == userData.userID) {
      Validation(validationMessages, setValidationMessages, 'userID', 'needVerifyID', userData.userID);
      return;
    } 

    const resultData = {
      "userID": userData.userID
    };
    const requestData = Cryption('encrypt', resultData);

    axios({
      method: "POST",
      url: process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/findbyid',
      data: requestData,
      headers: {'Content-type': 'application/json'}
    }).then((res)=>{
      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      
      // API로 부터 받은 데이터 출력
      if ( resultStatus == 'Success') {
        if (resultMessage == 'Not Exsits') {
          setIsVerifyID(true);
          setPreUserID(userData.userID);
          Validation(validationMessages, setValidationMessages, 'userVerifyID', 'available', userData.userID);
        } else {
          setIsVerifyID(false);
          Validation(validationMessages, setValidationMessages, 'userVerifyID', 'exists', userData.userID);
        }
      } else {
        setIsVerifyID(false);
        Validation(validationMessages, setValidationMessages, 'userVerifyID', 'server error', userData.userID);
      }
    }).catch(error=>{
        alert(error);
    });
  }

  const doCreateUser = async (e) => {
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

    const resultData = {
      "userID": userData.userID,
      "userPWD": userData.userPWD,
      "userPWDConfirm": userData.userPWDConfirm,
      "userName": userData.userName,
      "userPhone": userData.userPhone,
      "userEmail": userData.userEmail,
      "userAlias": userData.userAlias,
      "userAccountLink": "normal",
    };
    const requestData = Cryption('encrypt', resultData);

    axios({
      method: "POST",
      url: process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/create',
      data: requestData,
      // header에서 JSON 타입의 데이터라는 것을 명시
      headers: {'Content-type': 'application/json'}
    }).then((res)=>{
      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if ( resultStatus == 'Success') {
        alert("회원가입이 완료되었습니다.\n다시 로그인 해주세요.");
        navigate("/", { state: { isBack: true } });
      } else {
        alert(resultMessage);
      }
    }).catch(error=>{
        alert("axios 서버 오류입니다.");
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
                  onBlur={() => Validation(validationMessages, setValidationMessages, 'userID', 'pass', userData.userID)}
              />
              <button type="button" className="verify-button" onClick={verifyID}>인증하기</button>
            </div>
            <div className={(isVerifyID && preUserID == userData.userID) ? 'info-validation' : 'error-validation'}>{validationMessages.userIDValidationMessage}&nbsp;</div>
            <input
                type="password"
                placeholder="비밀번호"
                value={userData.userPWD}
                onChange={(e) => setUserData({...userData, userPWD: e.target.value})}
                onBlur={() => Validation(validationMessages, setValidationMessages, 'userPWD', 'pass', userData.userPWD)}
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
            <input
              type="text"
              placeholder="이름 입력"
              value={userData.userName}
              onChange={(e) => setUserData({...userData, userName: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userName', 'pass', userData.userName)}
            />
            <div className='error-validation'>{validationMessages.userNameValidationMessage}&nbsp;</div>
            <div className='input-id'>
              <input
                  type="text"
                  value={userData.userPhone}
                  disabled
              />
              <button onClick={verifyPhonePopupOpen}>휴대폰 인증하기</button>
            </div>
              <div className={isVerifyPhone ? 'info-validation' : 'error-validation'}>{validationMessages.userPhoneValidationMessage}&nbsp;</div>
            <input
              type="text"
              placeholder="이메일 주소 입력"
              value={userData.userEmail}
              onChange={(e) => setUserData({...userData, userEmail: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userEmail', 'pass', userData.userEmail)}
            />
            <div className='error-validation'>{validationMessages.userEmailValidationMessage}&nbsp;</div>
            <input
              type="text"
              placeholder="별명 입력"
              value={userData.userAlias}
              onChange={(e) => setUserData({...userData, userAlias: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userAlias', 'pass', userData.userAlias)}
            />
            <div className='error-validation'>{validationMessages.userAliasValidationMessage}&nbsp;</div>
            <button className="signup" onClick={doCreateUser}>회원 가입</button>
        </div>
      </div>
    );
  }

  return (
    <div>
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
      {isVerifyPhonePopupOpen && (
        <VerifyPhonePopup
          isOpen={isVerifyPhonePopupOpen}
          onClose={verifyPhonePopupClose}
          getRef = {getPopupRef}
          isVerifyPhonePopupClosing = {isVerifyPhonePopupClosing}
          userData = {userData}
          setUserData = {setUserData}
          isVerifyPhone = {isVerifyPhone}
          setIsVerifyPhone = {setIsVerifyPhone}
        />
      )}
    </div>
  );
}

export default CreateUser;