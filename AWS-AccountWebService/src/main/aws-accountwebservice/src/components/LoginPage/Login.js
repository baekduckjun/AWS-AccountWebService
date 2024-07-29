import React, { Component, useState, useEffect } from 'react';
import axios from "axios";

function Login(props) {
  const [status, setStatus] = useState("main");
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

    let url = 'http://localhost:8080/'+loginURL+'/login';
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

  if (status == 'main'){
    loginContents.push(
      <div>
        <button className="login" onClick={(event) => {
          setStatus("sign");
        }}>sign</button>
        <button className="login" onClick={(event) => {
          setStatus("login");
        }}>login</button>
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
  } else if (status == 'login') {

    loginContents.push(
      <div>
        <div className="left">
          <a href="#" className="button small" onClick={loginBack}>뒤로</a>
        </div>
        <form onSubmit={loginHandleSubmit}>
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
          />
          <button className="login" type="submit">로그인</button>
        </form>
        <button onClick={doGoogleLogin}>구글</button>
      </div>
    );
  } else if (status == 'complelte') {
    loginContents.push(
      <div>
        {memberName} 님 안녕하세요.
        <button className="login" type="submit" onClick={logOut}>로그아웃</button>
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