import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// JWT 토큰을 확인하는 함수 (로컬 스토리지에서 가져오는 예시)
const isAuthenticated = () => {
    const token = localStorage.getItem('access');
    // 토큰이 유효한지 간단히 확인하는 로직
    if (token == null) 
        return null;
    else
        return token;
    //수정해야함
};

// 인증 체크 컴포넌트
export const JWTAuthRoute = ({ children , loginType}) => {
    const navigate = useNavigate();
    const [alertShown, setAlertShown] = useState(false);

    useEffect(() => {
        if (loginType == "login") {
            if (!isAuthenticated()) {
                if (!alertShown) {
                    alert("로그인 하고 이용해주세요");
                    setAlertShown(true); // alert가 보여졌음을 기록
                }
                navigate("/");
            }
        } else {
            if (isAuthenticated()) {
                navigate("/components/MainPage/Main");
            }
        }
    }, [navigate, alertShown]);

    // 인증된 경우 자식 컴포넌트를 렌더링
    return isAuthenticated() && loginType=="login" ? children : !isAuthenticated() && loginType=="notLogin" ? children : null;
};

export default JWTAuthRoute;