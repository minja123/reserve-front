import type { Resource, TimeSlot } from "@/types/reservation";
import axios, { type AxiosResponse } from "axios";

// 1. 백엔드 ApiResponse 구조와 일치하는 인터페이스 정의
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
});

// 2. Response Interceptor 설정
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    //백엔드에서 보낸 ApiResponse 객체
    const res = response.data;

    // 비지니스 로직 상 성공인 경우, 알맹이(data)만 반환
    if (res.status === 200) {
      return res.data;
    }

    // 비즈니스 로직 상 에러인 경우 (예: 잔여석 없음)
    return Promise.reject(new Error(res.message || '요청 실패'));
  }
)

export interface ReservationRequest {
  timeSlotId: number;
  userEmail: string;
}

export interface PaymentProcessRequest {
  reservationId: number;
  decision: 'SUCCESS' | 'FAIL';
}

export const reservationApi = {
  /**
   * 1. 리소스(장소) 목록 조회
   */
  getResources: (): Promise<Resource[]> => {
    return api.get('/resources');
  },

  /**
   * 2. 특정 리소스의 타임슬롯 조회
   */
 getTimeSlots: (resourceId: number, startDate: string): Promise<TimeSlot[]> => {
    return api.get('/timeslots', { params: { resourceId, startDate } });
  },

  /**
   * 3. 예약 생성 (상태를 HOLE로 변경 시도)
   */
  createReservation: (data: ReservationRequest): Promise<number> => {
    return api.post('/reservations', data);
  },

  /**
   * 4. 결제 처리 (성공 시 CONFIRMED, 실패 시 CANCELLED/AVAILABLE)
   */
  processPayment: (data: PaymentProcessRequest) => {
    return api.post('/payments/process', data);
  }
}
