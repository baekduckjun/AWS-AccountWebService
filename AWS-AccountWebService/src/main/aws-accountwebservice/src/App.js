import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import 'App.css';
import Login from 'components/LoginPage/Login';
import CreateUser from 'components/CreateUserPage/CreateUser';

const forwardTransition = {
  initial: { opacity: 0, x: 100 },   // 오른쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: -100 },     // 왼쪽으로 나감
};

const backwardTransition = {
  initial: { opacity: 0, x: -100 },  // 왼쪽에서 시작
  animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
  exit: { opacity: 0, x: 100 },      // 오른쪽으로 나감
};

function AnimatedRoutes() {
  const location = useLocation();
  const isBack = location.state?.isBack || false; // 뒤로 가기 여부 판단

  const transition = isBack ? backwardTransition : forwardTransition;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition}
            >
              <Login />
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
              <CreateUser />
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