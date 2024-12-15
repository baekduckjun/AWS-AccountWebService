import React, { Component, useState, useEffect } from 'react';
import 'components/MainPage/Main.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Logout from 'components/MainPage/Logout';

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴
import {DoJWTRefresh} from 'utils/DoJWTRefresh'; // utile.js 파일을 가져옴

function doGetUserInfo(userID) {

  const resultData = {
    userID : userID,
  };
  const requestData = Cryption('encrypt', resultData);
  
  let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/getuserinfo';
  const getUserInfo = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: url,
        data: requestData,
        // header에서 JSON 타입의 데이터라는 것을 명시
        headers: {
          'Content-type': 'application/json',
          'access': localStorage.getItem('access')
        },
        withCredentials: true // CROS true
      });

      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if (resultStatus == 'Success') {
        if (resultMessage == 'Success') {
          return Cryption('decrypt', resultData);
        } else if (resultMessage == 'Access Token Expired') {
          await DoJWTRefresh();
        }
      } else {
        alert(resultMessage);
      }
    } catch(error){
      alert(error);
    }
  };

  return getUserInfo();
}

function doGetAccountInfo(userID) {

  const resultData = {
    userID : userID,
  };
  const requestData = Cryption('encrypt', resultData);
  
  let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_ACCOUNT_URL+'/getaccountinfo';
  const getAccountInfo = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: url,
        data: requestData,
        // header에서 JSON 타입의 데이터라는 것을 명시
        headers: {
          'Content-type': 'application/json',
          'access': localStorage.getItem('access')
        },
        withCredentials: true // CROS true
      });

      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if (resultStatus == 'Success') {
        if (resultMessage == 'Success') {
          return Cryption('decrypt', resultData);
        } else if (resultMessage == 'Access Token Expired') {
          await DoJWTRefresh();
        }
      } else {
        alert(resultMessage);
      }
    } catch(error){
      alert(error);
    }
  };

  return getAccountInfo();
}

function Main(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // 비동기 함수를 사용하여 데이터를 가져오는 함수
  const fetchUserData = async () => {
    const result = await doGetUserInfo("zkdlem0309");
    setUserData(result); // 응답이 도착하면 상태 업데이트
  };

  useEffect(() => {
    fetchUserData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []); // 빈 배열을 두 번째 인자로 주어 마운트 시 한 번만 실행
  
  let mainContents = [];

  const openBankingAutorize = () => {
    const newWindow = window.open("", "_self");
  
    if (process.env.REACT_APP_OPENBANKING_TEST == 'Y') {
      navigate("/components/SignAccountPage/SignAccount", {
        state: { userID: userData.userID }
      });
  
    } else {
      let url = 'https://testapi.openbanking.or.kr/oauth/2.0/authorize'
      +'?response_type=code'
      +'&client_id='+process.env.REACT_APP_OPENBANKING_CLIENTID
      +'&redirect_uri='+process.env.REACT_APP_DOMAIN+'/'+process.env.REACT_APP_ACCOUNT_URL+'/authorize'
      +'&scope=login inquiry transfer'
      +'&client_info=test'
      +'&state=b80BLsfigm9OokPTjy03elbJqRHOfGSY'
      +'&auth_type=1';
  
      newWindow.location.href = url;
    }
  };

  if (userData) {
    mainContents.push(
      <div>
        <div className="content">
          <div className="asset-box">
            { userData.isRegAccount == 'N' 
            ?
            <button onClick={openBankingAutorize}>계좌 등록 하기</button>
            :
              <div>
                <h2>내 페이머니</h2>
                <p>5,000,000원</p>
              </div>
            }
            <div className="asset-buttons">
              <button onClick="location.href='#';">충전</button>
              <button onClick="location.href='#';">송금</button>
              <button onClick="location.href='#';">결제</button>
            </div>
          </div>
          <div className="menu">
            <a href="#">내 프로필</a>
            <a href="#">설정</a>
            <a href="#">알림</a>
            <Logout></Logout>
          </div>
        </div>
        <div className="navbar">
          <a href="#">
            <img src="/menu.png" className="menu1" alt="메뉴"></img>
          </a>
          <a href="#">
            <img src="/home.png" className="home" alt="홈"></img>
          </a>
          <a href="#">
            <img src="/money.png" className="money" alt="돈"></img>
          </a>
          <a href="#">
            <img src="/mypage.webp" className="mypage" alt="마이페이지"></img>
          </a>
        </div>
      </div>
    );
  }
  return (
    <div>
      {mainContents}
    </div>
  );
}

export default Main;