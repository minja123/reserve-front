<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h2>로그인</h2>
        <p>서비스 이용을 위해 계정 정보를 입력해주세요.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model="loginData.username" placeholder="아이디를 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="loginData.password" placeholder="비밀번호를 입력하세요" required />
        </div>

        <button type="submit" class="login-btn">로그인</button>
      </form>

      <div class="login-footer">
        <span>계정이 없으신가요?</span>
        <router-link to="/signup">회원가입 하기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '@/api/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginData = reactive({
  username: '',
  password: ''
})
const handleLogin = async () => {

  try {

    const data = await authApi.login(loginData);

    console.log(data);

    // 2. 토큰 저장 (client.ts에서 이 이름으로 꺼내 씀)
    localStorage.setItem('accessToken', data);

    router.push('/');

  } catch (error: any) {
    // 백엔드에서 보낸 에러 메시지(res.message)가 출력됩니다.
    alert(error.message || '회원가입 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.input-group label {
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #34495e;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  /* 패딩 포함 너비 계산 */
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #42b983;
}

.login-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 14px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background-color: #3aa876;
}

.login-footer {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.login-footer a {
  margin-left: 8px;
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
</style>