import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import apiClient from '../api';
import type { LoginData, SignupData } from '../types/types';

/* 통합 시 export 주석 해제하기  */
interface User {
  id: string;
  name: string;
  email: string;
  userRole: string;
}

// 인증 상태(isLogined) 관리 위한 context의 type
interface AuthContextType {
  user: User | null;
  isLoading: boolean; // api 응답이 왔는지의 여부
  /* signup, login api 요청들 : 
	SignupData or LoginData를 받아서 Promise 형태의 응답을 return. */
  signUp: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 렌더 시 저장된 토큰 있는지 확인
  useEffect(() => {
    const checkLogined = async () => {
      // 저장된 인증 토큰 있는지 확인 (있으면 로그인 유지)
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const response = await apiClient.get<User>('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('토큰을 가진 유저 가져오기 실패', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    }; // end of checkLogined()

    checkLogined();
  }, []);

  /* 회원가입 함수 */
  const signUp = async (data: SignupData) => {
    // apiClient로 api call 보내기
    const response = await apiClient.post('/api/auth/user', {
      authType: 'APPLICANT', //고정
      info: {
        type: 'APPLICANT', // 고정
        name: data.name,
        email: data.email,
        password: data.password,
        successCode: 'success', // 값 변경 가능
      }, // end of info
    }); // end of apiClient.post();

    // 회원가입 response에서 token만 가져오기
    const { token } = response.data;
    // 인증 token : localStorage에 저장
    localStorage.setItem('authToken', token);

    // signup 후 자동 로그인
    const userResponse = await apiClient.get<User>('/api/auth/me');
    setUser(userResponse.data);
  };

  /* 로그인 함수 */
  const login = async (data: LoginData) => {
    const response = await apiClient.post('/api/auth/user/session', {
      email: data.email,
      password: data.password,
    });
    const { token } = response.data;
    // 로그인 상태
    localStorage.setItem('authToken', token);

    // 유저 정보
    const userResponse = await apiClient.get<User>('/api/auth/me');
    setUser(userResponse.data);
  };

  /* 로그아웃 함수 */
  const logout = async () => {
    try {
      await apiClient.delete('/api/auth/user/session');
    } catch (error) {
      console.error('로그아웃 실패 - 클라이언트 측 정보 지우기만 진행', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  // end of AuthProvider
};

// // custom Hook -> 다른 컴포넌트들에서 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 안에서 사용되어야 함');
  }
  return context;
  // end of useAuth
};
