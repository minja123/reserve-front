import client from "./client";

export const authApi = {
  /**
   * 회원가입
   */
  signup: (userData: any): Promise<any> => {
    return client.post('/auth/signup', userData);
  },

  /**
   * 로그인
   */
  login: (credentials: any): Promise<string> => {
    return client.post('/auth/login', credentials);
  }
}