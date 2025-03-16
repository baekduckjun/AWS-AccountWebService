import React, { Component, useState, useEffect, useRef } from 'react';
import 'components/CreateSignForm/CreateSignForm.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

import Header from 'components/CreateSignForm/Header/Header';
import Contents from 'components/CreateSignForm/Contents/Contents';
import Footer from 'components/CreateSignForm/Footer/Footer';
import VerifyPhonePopup from 'components/PopupPage/VerifyPhonePopup';

import { Transition } from 'utils/css/Transition'; // utile.js 파일을 가져옴
import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

function CreateSignForm(props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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

  const goBack = (e) => {
    e.preventDefault();

    if (step==0) {
      navigate("/", { state: { isBack: true } });
    } else {
      setStep(step-1);
    }
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

    setStep(step+1);
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

  createUserContents.push(
    <div className="createuser_container">
      <div className="container">
        <Header {...props.step[step].header} goBack={goBack}></Header>
        <div className="logo">
          <img src="/loginLogo.jpg" alt="logo"></img>
        </div>
        <Contents
          contents={props.step[step].contents}
          userData={userData} 
          setUserData={setUserData}
          validationMessages={validationMessages}
          setValidationMessages={setValidationMessages}
          verifyID={verifyID}
          isVerifyID={isVerifyID}
          setIsVerifyID={setIsVerifyID}
          preUserID={preUserID}
          verifyPhonePopupOpen={verifyPhonePopupOpen}
          isVerifyPhone={isVerifyPhone}
        >
        </Contents>
        <Footer {...props.step[step].footer} goNextStep={goNextStep}></Footer>
      </div>
    </div>
  );

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step1"
            variants={Transition.backTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >{createUserContents}</motion.div>
        )};
        {step === 1 && (
          <motion.div
            key="step2"
            variants={Transition.nextTransition}
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

export default CreateSignForm;