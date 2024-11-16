import React, { Component, useState, useEffect, useRef } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import VerifyPhonePopup from 'components/PopupPage/VerifyPhonePopup';

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

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

  {/** 휴대폰 인증 팝업 **/}
  const [isVerifyPhonePopupOpen, setIsVerifyPhonePopupOpen] = useState(false);      // 팝업 실행 유무
  const [isVerifyPhonePopupClosing, setIsVerifyPhonePopupClosing] = useState(false);// 팝업이 닫힐 시 애니메이션을 위한 먼저 true

  const VerifyPhonePopupOpen = () => {
    setIsVerifyPhonePopupOpen(true);
    setIsVerifyPhonePopupClosing(false);
  };

  const VerifyPhonePopupClose = () => {
    setIsVerifyPhonePopupClosing(true); // 팝업이 닫힐 시 애니메이션 실행 하기위한 먼저 true 
    setTimeout(() => {
      setIsVerifyPhonePopupOpen(false); // 애니메이션 후 팝업 닫기
    }, 300); // 애니메이션 시간
  };

  const popupRef = useRef(null);
  // 콜백 함수 정의
  const getPopupRef = (ref) => {
    if (ref) {
      popupRef.current = ref; // ref가 유효할 때만 설정
    }
  };

  useEffect(() => {
    // 팝업 외부 클릭 감지 함수
    const verifyPhonePopupOutSideClick = (event) => {
      VerifyPhonePopupClose();
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

  const doCreateUser = async (e) => {
    e.preventDefault();

    const resultData = {
      "userID": userData.userID,
      "userPWD": userData.userPWD,
      "userPWDConfirm": userData.userPWDConfirm,
      "userName": userData.userName,
      "userPhone": userData.userPhone,
      "userEmail": userData.userEmail,
      "userAlias": userData.userAlias,
      "userAccountLink": "google",
    };
    const requestData = Cryption('encrypt', resultData);

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
        <div className='input-id'>
          <input
              type="text"
              value={userData.userPhone}
              disabled
          />
          <button onClick={VerifyPhonePopupOpen}>휴대폰 인증하기</button>
        </div>
        <div className={isVerifyPhone ? 'info-validation' : 'error-validation'}>{validationMessages.userPhoneValidationMessage}&nbsp;</div>
        <input
          type="text"
          placeholder="별명 입력"
          value={userData.userAlias}
          onChange={(e) => setUserData({...userData, userAlias: e.target.value})}
          onBlur={() => Validation(validationMessages ,setValidationMessages, 'userAlias', 'pass', userData.userAlias)}
        />
        <div className='error-validation'>{validationMessages.userAliasValidationMessage}&nbsp;</div>
        <button className="signup" onClick={doCreateUser}>추가 정보</button>
      </div>
    </div>
    );

  return (
    <div>
      {createUserContents}
      {isVerifyPhonePopupOpen && (
        <VerifyPhonePopup
          isOpen={isVerifyPhonePopupOpen}
          onClose={VerifyPhonePopupClose}
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

export default CreateUserAccountLink;