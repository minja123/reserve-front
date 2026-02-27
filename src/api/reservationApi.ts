import type { Resource, TimeSlot } from "@/types/reservation";
import client from "./client";

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
    return client.get('/resources');
  },

  /**
   * 2. 특정 리소스의 타임슬롯 조회
   */
 getTimeSlots: (resourceId: number, startDate: string): Promise<TimeSlot[]> => {
    return client.get('/timeslots', { params: { resourceId, startDate } });
  },

  /**
   * 3. 예약 생성 (상태를 HOLE로 변경 시도)
   */
  createReservation: (data: ReservationRequest): Promise<number> => {
    return client.post('/reservations', data);
  },

  /**
   * 4. 결제 처리 (성공 시 CONFIRMED, 실패 시 CANCELLED/AVAILABLE)
   */
  processPayment: (data: PaymentProcessRequest) => {
    return client.post('/payments/process', data);
  }
}
