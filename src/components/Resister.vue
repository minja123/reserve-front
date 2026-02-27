<template>
  <div class="container">
    <form class="signup-form" @submit.prevent="handleSubmit">
      <input v-model="form.username" placeholder="아이디" required />
      <input v-model="form.password" type="password" placeholder="비밀번호" required />
      <input v-model="form.email" type="email" placeholder="이메일" required />
      <button type="submit">가입하기</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '@/api/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  email: ''
});

const handleSubmit = async () => {
  try {
    // 1. API 호출 (client.ts의 인터셉터가 응답 200 체크)
    await authApi.signup(form);

    alert('회원가입이 완료되었습니다.');
    router.push('/login'); // 가입 후 로그인 페이지로 이동
  } catch (error: any) {
    // 백엔드에서 보낸 에러 메시지(res.message)가 출력됩니다.
    alert(error.message || '회원가입 중 오류가 발생했습니다.');
  }
}
</script>

<style scoped></style>