import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';

import 'App.css';
import Login from 'components/LoginPage/Login';
import CreateUser from 'components/CreateUserPage/CreateUser';
import CreateUserAccountLink from 'components/CreateUserPage/CreateUserAccountLink';
import {JWTAuthRoute} from 'utils/JWTAuthRoute'; // utile.js 파일을 가져옴
import Main from 'components/MainPage/Main';

const nextTransition = {
  initial: { opacity: 0, x: 100 },   // 오른쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: -100 },     // 왼쪽으로 나감
};

const backTransition = {
  initial: { opacity: 0, x: -100 },  // 왼쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: 100 },      // 오른쪽으로 나감
};

function AnimatedRoutes() {
  const location = useLocation();
  const isBack = location.state?.isBack || false; // 뒤로 가기 여부 판단

  const transition = isBack ? backTransition : nextTransition;

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
