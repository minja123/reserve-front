<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="logo">MyBrand</div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">로그인</router-link></li>
        <li><router-link to="/signup" class="signup-btn">회원가입</router-link></li>
      </ul>
    </nav>

    <header class="hero">
      <h1>환영합니다!</h1>
      <p>Vue.js로 만든 멋진 첫 번째 페이지입니다.</p>
      <button @click="goToSignup" class="cta-button">시작하기</button>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToSignup = () => {
  router.push('/signup');
};
</script>

<style scoped>
/* 전체 레이아웃 */
.home-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* 네비게이션 바 스타일 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  /* Vue 공식 컬러 느낌 */
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}

.signup-btn {
  background-color: #42b983;
  color: white !important;
  padding: 8px 16px;
  border-radius: 5px;
}

/* 히어로 섹션 스타일 */
.hero {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.cta-button {
  margin-top: 2rem;
  padding: 12px 30px;
  font-size: 1.1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: scale(1.05);
}
</style>