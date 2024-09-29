import React, { Component, useState, useEffect } from 'react';
import 'components/MainPage/Main.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

function Main(props) {

  let mainContents = [];

  mainContents.push(
    <div>
      <div className="content">
        <div className="asset-box">
          <h2>내 페이머니</h2>
          <p>5,000,000원</p>
          <div className="asset-buttons">
            <button onclick="location.href='#';">충전</button>
            <button onclick="location.href='#';">송금</button>
            <button onclick="location.href='#';">결제</button>
          </div>
        </div>
        <div className="menu">
          <a href="#">내 프로필</a>
          <a href="#">설정</a>
          <a href="#">알림</a>
          <a href="#">로그아웃</a>
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

  return (<div>{mainContents}</div>);
}

export default Main;