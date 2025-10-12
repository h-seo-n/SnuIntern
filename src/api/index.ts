import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
});
// 인증 토큰 필요 X인 endpoint들
const publicPaths = [
  '/api/auth/user', //회원가입
  '/api/auth/user/session', //로그인
];

// endpoints needing auth

// interceptor(API 요청을 intercept하는 아이) : 인증이 필요한 endpoint들에 인증 토큰 자동 부여
apiClient.interceptors.request.use(
  (config) => {
    const isPublicPath =
      config.url &&
      publicPaths.includes(config.url) &&
      config.method === 'post';

    if (!isPublicPath) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
