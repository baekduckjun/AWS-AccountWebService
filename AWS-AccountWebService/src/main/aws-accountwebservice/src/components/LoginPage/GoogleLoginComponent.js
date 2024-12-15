import React, { Component, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Cryption } from 'utils/Cryption'; // utile.js 파일을 가져옴

import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // 구글 응답 값 decode

const googleConfig = {
    clientID: process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID,
    clientPWD: process.env.REACT_APP_GOOGLE_OAUTH_CLIENTPWD,
};

let resultData = {};

function GoogleCreateUser(data) {
    /* 
      - aud : ID 토큰의 대상 애플리케이션에 대한 고유 식별자
      - azp : ID 토큰을 사용하여 액세스 요청을 수행하는 애플리케이션에 대한 고유 식별자
      - email : 이메일 주소
      - email-verified : 이메일 검증이 되었는가 ?
      - exp : ID 토큰 만료기간
      - family-name : 사용자의 last-name
      - given-name : 사용자의 first-name
      - iat : ID 토큰 발급 시간
      - iss : ID 토큰을 발급한 발급자의 URL 구글인 경우 accounts.google.com
      - jti : ID 토큰의 고유 식별자, 일회용 토큰을 처리하는데 사용
      - name : 사용자의 전체 이름
      - nbf : ID 토큰이 사용되기전, 기다려야하는 시간
      - picture : 사용자의 프로필 url
      - sub : 사용자의 고유 식별자, 사용자가 어플리케이션에 로그인할때마다 동일하게 유지
    */
    // 전송하고 싶은 데이터를 객체로 정의
    resultData = {
        "userID": data.email,
        "userPWD": data.email,
        "userPWDConfirm": data.email,
        "userName": data.name,
        "userPhone": "",
        "userEmail": data.email,
        "userAlias": "",
        "userAccountLink": "google",
    };
    const requestData = Cryption('encrypt', resultData);

    const verifyID = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL + '/findbyid',
                data: requestData,
                headers: { 'Content-type': 'application/json' }
            });

            const result = res.data;
            const resultStatus = result.status;
            const resultMessage = result.result;
            const resultData = result.data;
            if (resultStatus == 'Success') {
                if (resultMessage === 'Not Exsits') {
                    alert("구글 연동이 완료되었습니다.\n추가 정보를 입력해야 회원가입이 완료됩니다.");
                    return "Create";
                } else {
                    return "Login";
                }
            } else {
                alert(resultMessage);
                return "error";
            }
        } catch (error) {
            alert('오류 발생: ' + error.message);
            return false;
        }
    };

    return verifyID(); // async 함수의 실행 결과 반환
}

function doLogin(data) {
    const resultData = {
        userID : data.userID,
        userPWD : data.userPWD,
    };
    const requestData = Cryption('encrypt', resultData);

    let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_USER_URL+'/dologin';
    const login = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: url,
                data: requestData,
                // header에서 JSON 타입의 데이터라는 것을 명시
                headers: {'Content-type': 'application/json'},
                withCredentials: true // cookie 보내기
            });

            const result = res.data;
            const resultStatus = result.status;
            const resultMessage = result.result;
            const resultData = result.data;
            if (resultMessage == 'Success') {
                const accessToken = res.headers.get('Access');
                if (accessToken) {
                    localStorage.setItem('access', accessToken);
                }
                return "Success";
            } else {
                alert(resultMessage);
            }
        } catch(error){
            alert(error);
        }
    };

    return login();
}

function GoogleLoginComponent(props) {
    const navigate = useNavigate();

    let googleContents = [];

    googleContents.push(
        <GoogleOAuthProvider clientId={googleConfig.clientID}>
            <GoogleLogin
                onSuccess={async (res) => {
                    let googleResult = jwtDecode(res.credential);
                    const createGoogleUserResult = await GoogleCreateUser(googleResult); // GoogleCreateUser가 완료될 때까지 기다림
                    if (createGoogleUserResult == "Create") {
                        // navigate 함수에 state를 이용해 데이터를 전송
                        resultData = {
                            ...resultData,
                            "userID": googleResult.email,
                        };
                        navigate("/components/CreateUserPage/CreateUserAccountLink", { state: { userAccountData: resultData } });
                    } else if (createGoogleUserResult == "Login") {
                        resultData = {
                            ...resultData,
                            "userID": googleResult.email,
                        };
                        
                        const result = await doLogin(resultData);
                        if ("Success" == result) {
                            navigate("/components/MainPage/Main", {
                                state: { userID: googleResult.email }
                            });
                        }
                    }
                }}
                onFailure={(err) => {
                    alert(err);
                }}
            />
        </GoogleOAuthProvider>
    );

    return (<div>{googleContents}</div>);
}

export default GoogleLoginComponent;