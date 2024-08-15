import React, { Component, useState, useEffect } from 'react';
import 'components/CreateUserPage/CreateUser.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

const backTransition = {
  initial: { opacity: 0, x: 100 },   // 오른쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: -100 },     // 왼쪽으로 나감
};

const nextTransition = {
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
  const [userEmail, setUserEmail] = useState('');
  
  let createUserContents = [];
  let userURL = "api/v1/user";

  const goMain = (e) => {
    e.preventDefault();
    navigate("/", { state: { isBack: true } });
  }

  const goBack = (e) => {
    e.preventDefault();
    setStatus('step1');
  }

  const goNextStep = (e) => {
    e.preventDefault();
    setStatus('step2');
  }

  const createUserHandleSubmit = async (e) => {
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
          <form onSubmit={createUserHandleSubmit}>
            <div className='input-id'>
              <input
                  type="text"
                  placeholder="✉ 사용자 아이디 또는 이메일 주소"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
              />
              <button type="button" className="verify-button">인증하기</button>
            </div>
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
            <div className='input-id'>
              <input
                  type="text"
                  placeholder="✉ 사용자 아이디 또는 이메일 주소"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
              />
              <button type="button" className="verify-button">인증하기</button>
            </div>
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
              <button className="signup" type="submit">회원 가입</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
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