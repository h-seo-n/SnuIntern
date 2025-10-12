// import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// global state login import 해야함
// user type? import 해야함
// logic.ts import -> logout 처리

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // 로그아웃 이후 홈으로 이동
  };

  return (
    <div>
      <Link to={'/'}>스누인턴</Link>
      {user ? (
        <>
          <span>{user.name}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <Link to={'/signup'}>회원가입</Link>
          <Link to={'/login'}>로그인</Link>
        </>
      )}
    </div>
  );
};

export default Topbar;
