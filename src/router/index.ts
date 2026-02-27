import Home from '@/components/Home.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

//2. 라우터 정의
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // 3. 지연 로딩(Lazy Loading): 해당 페이지 방문 시에만 코드를 불러와 성능 최적화
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/components/Resister.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue')
  },
  {
    //동적 파라미터 예시
    path: '/user/:id',
    name: 'user-detail',
    component: () => import('../views/UserDetail.vue'),
    props: true //URL 파라미터를 컴포넌트의 props로 전달
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
