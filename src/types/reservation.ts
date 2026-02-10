export interface Resource {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export type TimeSlotStatus = 'AVAILABLE' | 'HOLD' | 'RESERVED';

export interface TimeSlot {
  id: number;
  resourceId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
}