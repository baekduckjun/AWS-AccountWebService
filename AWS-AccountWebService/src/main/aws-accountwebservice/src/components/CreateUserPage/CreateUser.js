import React, { Component, useState, useEffect } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateUser(props) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("step1");
  const [userID, setUserID] = useState('');
  const [userPWD, setUserPWD] = useState('');
  const [userPWDConfirm, setUserPWDConfirm] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  let signContents = [];
  let userURL = "api/v1/user";

  const goSignBack = (e) => {
    e.preventDefault();
    navigate("/", { state: { isBack: true } });
  }

  const signHandleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      "userID": userID,
      "userPWD": userPWD,
      "userPWDConfirm" : userPWDConfirm,
      "userName": userName,
      "userEmail": userEmail
    };

    if ("" == userID) {
      alert('아이디를 입력하세요');
      return;
    } 
    if ("" == userPWD) {
      alert('비밀번호를 입력하세요');
      return;
    } 
    if ("" == userName) {
      alert('이름을 입력하세요');
      return;
    } 
    if ("" == userEmail) {
      alert('이메일을 입력하세요');
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
        // API로 부터 받은 데이터 출력
        
      }
    }).catch(error=>{
        alert(error);
    });
  }

  if (status == 'step1'){
    signContents.push(
      <div class="signup_container">
        <div class="container">
          <div className="goback">
            <a href="#" className="" onClick={goSignBack}>뒤로</a>
          </div>
          <div class="logo">
            <img src="/loginLogo.jpg" alt="logo"></img>
          </div>
          <form onSubmit={signHandleSubmit}>
              <input
                  type="text"
                  placeholder="✉ 사용자 아이디 또는 이메일 주소"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="비밀번호"
                  value={userPWD}
                  onChange={(e) => setUserPWD(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={userPWDConfirm}
                  onChange={(e) => setUserPWDConfirm(e.target.value)}
              />
              <button class="signup" type="submit">회원가입</button>
          </form>
        </div>
      </div>
    );
  }

  return (
  <div>
    {signContents}
  </div>
  );
}

export default CreateUser;