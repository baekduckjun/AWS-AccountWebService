import React, { Component, useState, useEffect } from 'react';
import 'components/MainPage/Main.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴
import {DoJWTRefresh} from 'utils/DoJWTRefresh'; // utile.js 파일을 가져옴

function Logout(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userID : 'zkdlem0309',
  });

  const doLogout = () => {
    const resultData = {
      userID : userData.userID,
    };
    const requestData = Cryption('encrypt', resultData);
    
    let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/dologout';
    const logout = async () => {
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
        if (resultMessage == 'Success') {
          localStorage.removeItem('access');
          alert('로그아웃되었습니다.');
          navigate("/");
        } else {
          alert(resultMessage);
        }
      } catch(error){
        alert(error);
      }
    };
  
    return logout();
  };

  let logoutContents = [];

  logoutContents.push(
    <div>
      <a onClick={() => doLogout(userData.userID)}>로그아웃</a>
    </div>
  );

  return (
    <div>
      {logoutContents}
    </div>
  );
}

export default Logout;