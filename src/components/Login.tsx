import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = password.trim() != '' && email.trim() != '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log({ password, email }); // 테스트

    try {
      await login({ email, password });
      navigate('/'); // Redirect to home on success
    } catch (_err: unknown) {
      alert('로그인에 실패했습니다.');
    }
    return;
    // login()함수 호출해야함
  };

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label>이메일</label>
            <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <span>@snu.ac.kr</span> */}
          </div>

          <label>비밀번호</label>
          <br />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <p> 아직 회원이 아니신가요? </p>
          <Link to={'/signup'}>회원가입</Link>
        </div>
        <button type="submit" disabled={!isFormValid}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
