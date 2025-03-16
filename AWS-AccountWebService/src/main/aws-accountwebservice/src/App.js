import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';

import 'App.css';
import Login from 'components/LoginPage/Login';
import CreateUser from 'components/CreateUserPage/CreateUser';
import CreateUserAccountLink from 'components/CreateUserPage/CreateUserAccountLink';
import {JWTAuthRoute} from 'utils/JWTAuthRoute'; // utile.js 파일을 가져옴
import {Transition} from 'utils/css/Transition'; // utile.js 파일을 가져옴
import Main from 'components/MainPage/Main';
import SignAccount from 'components/SignAccountPage/SignAccount';
import {DoAccountAuthorize} from 'utils/DoAccountAuthorize';

import CreateSignForm from 'components/CreateSignForm/CreateSignForm'; //공통화 테스트

const CreateSignFormAssetData = {
  step: [
    {
      header: {
        title: "회원가입"
      },
      contents: {
        type: "USER",
        list: [
          {
            idx: 1,
            inputType: "text",
            type: "ID",
            title: "✉ 사용자 아이디 또는 이메일 주소",
            isVerify: true,
            isDisabled: false
          }, {
            idx: 2,
            inputType: "password",
            type: "PWD",
            title: "비밀번호",
            isVerify: false,
            isDisabled: false
          }, {
            idx: 3,
            inputType: "password",
            type: "PWD_CONFIRM",
            title: "비밀번호 확인",
            isVerify: false,
            isDisabled: false
          }
        ]
      },
      footer: {
        title: "다음단계 (1/2)"
      }
    },
    {
      header: {
        title: "회원가입"
      },
      contents: {
        type: "USER",
        list: [
          {
            idx: 4,
            inputType: "text",
            type: "NAME",
            title: "이름 입력",
            isVerify: true,
            isDisabled: false
          }, {
            idx: 5,
            inputType: "text",
            type: "PHONE",
            title: "휴대폰 번호",
            isVerify: false,
            isDisabled: true,
          }, {
            idx: 6,
            inputType: "text",
            type: "EMAIL",
            title: "이메일 주소 입력",
            isVerify: false,
            isDisabled: false
          }, {
            idx: 7,
            inputType: "text",
            type: "ALIAS",
            title: "별명 입력",
            isVerify: false,
            isDisabled: false
          }
        ]
      },
      footer: {
        title: "회원가입"
      }
    }
  ]
}

function AnimatedRoutes() {
  const location = useLocation();
  const isBack = location.state?.isBack || false; // 뒤로 가기 여부 판단

  const transition = isBack ? Transition.backTransition : Transition.nextTransition;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        {/* 로그인 페이지 */}
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="notLogin">
                <Login />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 회원 가입 페이지 */}
        <Route
          path="/components/CreateUserPage/CreateUser"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="notLogin">
                <CreateUser />
                {/*<CreateSignForm 
                  {...CreateSignFormAssetData}
                />*/}
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 연동 계정 추가 정보 */}
        <Route
          path="/components/CreateUserPage/CreateUserAccountLink"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="notLogin">
                <CreateUserAccountLink />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 아이디 및 패스워드 찾기 페이지 */}
        <Route
          path="/components/FindByIDPage/FindByID"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="notLogin">
                <CreateUser />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 로그인 후 메인 페이지 */}
        <Route
          path="/components/MainPage/Main"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="login">
                <Main />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 계좌 등록 테스트 페이지 */}
        <Route
          path="/components/SignAccountPage/SignAccount"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="login">
                <SignAccount />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 오픈뱅킹 API 인증 후 리다이렉션 */}
        <Route
          path="/utils/DoAccountAuthorize"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="login">
                <DoAccountAuthorize />
              </JWTAuthRoute>
            </motion.div>
          }
        />
        {/* 공통화 테스트테스트테스트 */}
        <Route
          path="/components/CreateSignForm/CreateSignForm"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <JWTAuthRoute loginType="notLogin">
                <CreateSignForm 
                  {...CreateSignFormAssetData}
                />
              </JWTAuthRoute>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
