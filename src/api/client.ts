import axios, { type AxiosResponse } from "axios";

// 백엔드 공통 응답 포맷
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

//모든 요청에 JWT 토큰 자동 삽입
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

//응답 데이터 처리 및 에러 핸들링
client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const res = response.data;

    if (res.status === 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.message || '요청 실패'));
  },
  (error) => {
    // 401 Unauthorized 등 HTTP 에러 처리
    if (error.response?.status === 401) {
      console.error('인증이 만료되었습니다.');
      //필요 시 로그아웃 처리 또는 이동
    }
    return Promise.reject(error);
  }
)

export default client;