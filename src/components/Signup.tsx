import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// logic.ts import 해야함

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const isFormValid =
    name.trim() != '' &&
    password.trim() != '' &&
    confirmPassword.trim() != '' &&
    email.trim() != '' &&
    password === confirmPassword;

  const isPasswordSame = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log({ name, password, email }); // 테스트

    try {
      await signUp({ name, email, password });
      navigate('/'); // Redirect to home on success
    } catch (_err: unknown) {
      alert('회원가입에 실패했습니다.');
    }
    return;
    // singup()함수 호출해야함
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호</label>
          <br />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <br />
          <input
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* 비밀번호와 다르면 에러 메시지 밑에 추가 */}
          {confirmPassword && !isPasswordSame && (
            <p style={{ color: 'red', fontSize: '14px' }}>
              비밀번호가 일치하지 않습니다
            </p>
          )}
          {/* 비밇번호 평가 */}
        </div>
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

        <button type="submit" disabled={!isFormValid}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
