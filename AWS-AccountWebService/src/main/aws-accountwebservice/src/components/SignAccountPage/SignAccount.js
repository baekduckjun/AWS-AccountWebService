import React, { Component, useState, useEffect, useRef } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴
import {DoJWTRefresh} from 'utils/DoJWTRefresh'; // utile.js 파일을 가져옴

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

function SignAccount(props) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("step1");
  const location = useLocation();
  const userID = location.state?.userID;
  const [accountData, setAccountData] = useState({
    userID: userID,
    accountCode: '',
    accountNumber: '',
    accountAlias: ''
  });

  {/** 밸리데이션 **/}
  const [validationMessages, setValidationMessages] = useState({
    accountCodeValidationMessage: '',
    accountNumberValidationMessage: '',
    accountAliasValidationMessage: ''
  });
  {/** 밸리데이션 **/}
  
  let signAccountContents = [];

  const [isVerifyAccount, setIsVerifyAccount] = useState(false);

  const goMain = (e) => {
    e.preventDefault();
    navigate("/components/MainPage/Main", { state: { isBack: true } });
  }

  const verifyAccount = async (e) => {
    e.preventDefault();
    setIsVerifyAccount(false);

    if ("" == accountData.accountNumber) {
      Validation(validationMessages, setValidationMessages, 'userID', 'needVerifyID', accountData.accountNumber);
      return;
    } 

    const resultData = {
      "userID": accountData.userID,
      "accountCode": accountData.accountCode,
      "accountNumber": accountData.accountNumber,
      "accountAlias": accountData.accountAlias
    };
    const requestData = Cryption('encrypt', resultData);

    axios({
      method: "POST",
      url: process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_ACCOUNT_URL+'/findbyaccountnumber',
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
          setIsVerifyAccount(true);
          Validation(validationMessages, setValidationMessages, 'userVerifyID', 'available', accountData.accountNumber);
        } else {
          setIsVerifyAccount(false);
          Validation(validationMessages, setValidationMessages, 'userVerifyID', 'exists', accountData.accountNumber);
        }
      } else {
        setIsVerifyAccount(false);
        Validation(validationMessages, setValidationMessages, 'userVerifyID', 'server error', accountData.accountNumber);
      }
    }).catch(error=>{
        alert(error);
    });
  }

  const doSignAccount = async (e) => {
    e.preventDefault();

    Validation(validationMessages, setValidationMessages, 'accountCode', '', accountData.accountCode);
    Validation(validationMessages, setValidationMessages, 'accountNumber', '', accountData.accountNumber);
    Validation(validationMessages, setValidationMessages, 'accountAlias', '', accountData.accountAlias);
    
    if (!isVerifyAccount) {
      Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'notVerifyPhone', accountData.accountNumber);
    } else {
      Validation(validationMessages, setValidationMessages, 'userVerifyPhone', 'available', accountData.accountNumber);
    }

    if ( ("" == accountData.accountCode || "" == accountData.accountNumber || "" == accountData.accountAlias) || !isVerifyAccount) {
        return;
    }

    const resultData = {
      "userID": accountData.userID,
      "accountCode": accountData.accountCode,
      "accountNumber": accountData.accountNumber,
      "accountAlias": accountData.accountAlias
    };
    const requestData = Cryption('encrypt', resultData);

    axios({
      method: "POST",
      url: process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_ACCOUNT_URL+'/sign',
      data: requestData,
      // header에서 JSON 타입의 데이터라는 것을 명시
      headers: {'Content-type': 'application/json'}
    }).then((res)=>{
      
      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if ( resultStatus == 'Success') {
        alert("sign 성공");
        navigate("/components/MainPage/Main", { state: { isBack: true } });
      } else {
        alert(resultMessage);
      }
    }).catch(error=>{
        alert("axios 서버 오류입니다.");
    });
  }

  signAccountContents.push(
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
          <div className='title'>계좌등록</div>
        </div>
        <div className="logo">
          <img src="/loginLogo.jpg" alt="logo"></img>
        </div>
        <form>
          <div className='input-id'>
          <label for="lang">은행 선택</label>
          <div className='error-validation'>{validationMessages.accountAliasValidationMessage}&nbsp;</div>
          <select onChange={(e) => {
              setAccountData({...accountData, accountCode: e.target.value}); 
            }}>
            <option value="select">은행 선택</option>
            <option value="004">국민은행</option>
            <option value="092">토스</option>
          </select>
          </div>
          <input
              type="text"
              placeholder="✉ 계좌 번호"
              value={accountData.accountNumber}
              onChange={(e) => {
                setAccountData({...accountData, accountNumber: e.target.value}); 
                setIsVerifyAccount(false);
              }}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'accountNumber', '', accountData.accountNumber)}
          />
          <div className='error-validation'>{validationMessages.accountNumberValidationMessage}&nbsp;</div>
          <button type="button" className="verify-button" onClick={verifyAccount}>인증하기</button>
          <input
              type="text"
              placeholder="계좌 별명"
              value={accountData.accountAlias}
              onChange={(e) => setAccountData({...accountData, accountAlias: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'accoountAlias', '', accountData.accountAlias)}
          />
          <div className='error-validation'>{validationMessages.accountAliasValidationMessage}&nbsp;</div>
          <button className="signup" onClick={doSignAccount}>계좌 등록</button>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {signAccountContents}
    </div>
  );
}

export default SignAccount;