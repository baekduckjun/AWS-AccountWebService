import React, { Component, useState, useEffect } from 'react';
import 'components/LoginPage/Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

import GoogleLoginComponent from 'components/LoginPage/GoogleLoginComponent';

function Login(props) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("login");
  const [userData, setUserData] = useState({
    userID: '',
    userPWD: ''
  });

  {/** 밸리데이션 **/}
  const [validationMessages, setValidationMessages] = useState({
    userIDValidationMessage: '',
    userPWDValidationMessage: '',
  });
  {/** 밸리데이션 **/}
  
  let loginContents = [];

  const goCreateUser = (e) => {
    e.preventDefault();
    navigate("/components/CreateUserPage/CreateUser");
  }
  const goFindByID = (e) => {
    e.preventDefault();
    navigate("/components/CreateUserPage/CreateUser");
  }
  const goResetPWD = (e) => {
    e.preventDefault();
    navigate("/components/CreateUserPage/CreateUser");
  }
  
  const doLogin = async (e) => {
    e.preventDefault();
    
    Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID);
    Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD);
    if (userData.userID == '' || userData.userPWD == '')
      return;
    
    const resultData = {
      userID : userData.userID,
      userPWD : userData.userPWD,
    };
    const requestData = Cryption('encrypt', resultData);

    let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/dologin';
    await axios({
      method: "POST",
      url: url,
      data: requestData,
      // header에서 JSON 타입의 데이터라는 것을 명시
      headers: {'Content-type': 'application/json'},
      withCredentials: true // CROS true
    }).then((res)=>{
      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if (resultStatus == 'Success') {
        if (resultMessage == 'Success') {
          const accessToken = res.headers.get('access');
          if (accessToken) {
            localStorage.setItem('access', accessToken);
          }
          navigate("/components/MainPage/Main");
        } else if (resultMessage = 'Fail'){
          alert(resultMessage);
        }
      } else {
        alert(resultMessage);
      }
    }).catch(error=>{
        alert(error);
    });
  }

  if ("login" === status) {
    loginContents.push(
      <div class="login_container">
        <div className="logo">
          <img src="loginLogo.jpg"></img>
        </div>
        <div className="container">
          <form onSubmit={doLogin}>
            <input
              type="text"
              placeholder="✉ 사용자 아이디 또는 이메일 주소"
              value={userData.userID}
              onChange={(e) => setUserData({...userData, userID: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userID', '', userData.userID)}
            />
            <div className='error-validation'>{validationMessages.userIDValidationMessage}&nbsp;</div>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userData.userPWD}
              onChange={(e) => setUserData({...userData, userPWD: e.target.value})}
              onBlur={() => Validation(validationMessages, setValidationMessages, 'userPWD', '', userData.userPWD)}
            />
            <div className='error-validation'>{validationMessages.userPWDValidationMessage}&nbsp;</div>
            <button className="login" type="submit">로그인</button>
          </form>
          <br/>
          <div className="annotherLogin">
            <GoogleLoginComponent></GoogleLoginComponent>
            <img src="/loginKakao.webp" onClick={() => window.open('https://accounts.kakao.com/login/?continue=https%3A%2F%2Fcs.kakao.com%2F#login', '_blank')}></img>
            <img src="/loginNaver.png" onClick={() => window.open('https://accounts.kakao.com/login/?continue=https%3A%2F%2Fcs.kakao.com%2F#login', '_blank')}></img>
          </div>
          <button className="signup" onClick={goCreateUser}>회원가입</button>
        </div>
        <div className="find-container">
          <a className="finding-link">아이디</a>
          <p>/</p>
          <a className="finding-link">비밀번호 찾기</a>
        </div>
      </div>
    );
  }

  return (<div>{loginContents}</div>);
}

export default Login;