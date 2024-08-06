import React, { Component, useState, useEffect } from 'react';
import axios from "axios";

function Login(props) {
  const [status, setStatus] = useState("login");
  const [memberID, setMemberID] = useState('');
  const [memberPWD, setMemberPWD] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  
  let loginContents = [];
  let memberURL = "api/v1/user";
  let loginURL = "api/v1/login";
  const googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='
    + '246203568306-3m9pf28g5t23q4937o21b8obninr9us0.apps.googleusercontent.com'
    + '&redirect_uri=https://baekduduck.duckdns.org'
    + '&response_type=code'
    + '&scope=email profile';
  
  const loginBack = (e) => {
    e.preventDefault();

    setStatus('main');
  }

  const logOut = (e) => {
    e.preventDefault();

    setStatus('main');
  }

  const signHandleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      "memberID": memberID,
      "memberPWD": memberPWD,
      "memberName": memberName,
      "memberEmail": memberEmail
    };

    if ("" == memberID) {
      alert('아이디를 입력하세요');
      return;
    } 
    if ("" == memberPWD) {
      alert('비밀번호를 입력하세요');
      return;
    } 
    if ("" == memberName) {
      alert('이름을 입력하세요');
      return;
    } 
    if ("" == memberEmail) {
      alert('이메일을 입력하세요');
      return;
    } 

    axios({
      method: "POST",
      url: 'http://localhost:8080/'+memberURL+'/create',
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
  }

  const loginHandleSubmit = async (e) => {
    e.preventDefault();
    
    const requestData = {
      "memberID": memberID,
      "memberPWD": memberPWD
    };

    if ("" == memberID) {
      alert('아이디를 입력하세요');
      return;
    } 
    if ("" == memberPWD) {
      alert('비밀번호를 입력하세요');
      return;
    } 

    let url = 'http://localhost:8080/'+loginURL+'/doLogin';
    axios({
      method: "POST",
      url: url,
      data: requestData,
      // header에서 JSON 타입의 데이터라는 것을 명시
      headers: {'Content-type': 'application/json'},
      withCredentials: true // CROS true
    }).then((res)=>{
      let result = res.data;
      let resultMessage = result.result;
      let resultData = result.data;
      if (resultMessage != 'Success') {
        alert(resultMessage);
      } else {
        // API로 부터 받은 데이터 출력
        setMemberID(resultData.memberID);
        setMemberName(resultData.memberName);
        setMemberEmail(resultData.memberEmail);
        setStatus('complelte');
      }
    }).catch(error=>{
        alert(error);
    });
  }

  const doGoogleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  if (status == 'login'){
    loginContents.push(
      <div class="login_container">
        <div className="logo">
          <img src="loginLogo.jpg"></img>
        </div>
        <div className="container">
          <form onSubmit={loginHandleSubmit}>
            <input
              type="text"
              placeholder="✉ 사용자 아이디 또는 이메일 주소"
              value={memberID}
              onChange={(e) => setMemberID(e.target.value)}
            />
            <input
              type="password"
              placeholder="Caps Lock 해제 후 입력"
              value={memberPWD}
              onChange={(e) => setMemberPWD(e.target.value)}
            />
            <button className="login" type="submit">로그인</button>
          </form>
          <br/>
          <div className="annotherLogin">
            <img src="loginGoogle.png" onClick={() => window.open('https://accounts.google.com/v3/signin/identifier?authuser=0&continue=https%3A%2F%2Fmyaccount.google.com%2F%3Fhl%3Dko%26utm_source%3DOGB%26utm_medium%3Dact&ec=GAlAwAE&hl=ko&service=accountsettings&flowName=GlifWebSignIn&flowEntry=AddSession&dsh=S-587032328%3A1720164582207694&ddm=0', '_blank')}></img>
            <img src="loginKakao.webp" onClick={() => window.open('https://accounts.kakao.com/login/?continue=https%3A%2F%2Fcs.kakao.com%2F#login', '_blank')}></img>
            <img src="loginNaver.png" onClick={() => window.open('https://accounts.kakao.com/login/?continue=https%3A%2F%2Fcs.kakao.com%2F#login', '_blank')}></img>
          </div>
          <button className="signup" onClick={() => setStatus('sign')}>회원가입</button>
        </div>
        <div className="find-container">
          <a className="finding-link">아이디</a>
          <p>/</p>
          <a className="finding-link">비밀번호 찾기</a>
        </div>
      </div>
    );
  } else if (status == 'sign'){

    loginContents.push(
      <div>
        <div className="left">
          <a href="#" className="button small" onClick={loginBack}>뒤로</a>
        </div>
        <form onSubmit={signHandleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={memberID}
            onChange={(e) => setMemberID(e.target.value)}
          /><br/>
          <input
            type="password"
            placeholder="비밀번호"
            value={memberPWD}
            onChange={(e) => setMemberPWD(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="이름"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          /><br/>
          <input
            type="email"
            placeholder="이메일"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
          />
          <button className="login" type="submit">회원 등록</button>
        </form>
      </div>
    );
  }

  return (
  <div>
    {loginContents}
  </div>
  );
}

export default Login;