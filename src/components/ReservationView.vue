<template>
  <div class="reservation-wrapper">
    <header class="page-header">
      <h1>📅 서비스 예약</h1>
      <p>원하시는 장소와 시간을 선택해주세요.</p>
    </header>

    <main class="content">
      <section class="card section-resource">
        <h3>1. 장소 선택</h3>
        <div class="resource-grid">
          <div v-for="res in resources" :key="res.id"
            :class="['resource-item', { active: selectedResource?.id === res.id }]" @click="fetchTimeSlots(res)">
            <span class="icon">🏠</span>
            <span class="name">{{ res.name }}</span>
          </div>
        </div>
      </section>

      <section v-if="selectedResource" class="card section-slots">
        <h3>2. 시간 선택</h3>
        <div class="slot-container">
          <div v-for="slot in timeslots" :key="slot.id" :class="['slot-card', slot.status.toLowerCase()]"
            @click="slot.status === 'AVAILABLE' && openPaymentModal(slot)">
            <div class="time">{{ formatTime(slot.startTime) }}</div>
            <div class="status-badge">{{ getStatusText(slot.status) }}</div>
          </div>
        </div>
      </section>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h3>예약 확정</h3>
        <p>선택하신 시간: {{ formatTime(selectedSlot?.startTime) }}</p>
        <div class="input-group">
          <label>이메일</label>
          <input v-model="email" type="email" placeholder="example@email.com" />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showModal = false">취소</button>
          <button class="btn-confirm" @click="confirmReservation">결제 및 예약</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Resource, TimeSlot } from '@/types/reservation'
import axios from 'axios'
import { onMounted, ref } from 'vue'


const resources = ref<Resource[]>([])
const timeslots = ref<TimeSlot[]>([])
const selectedResource = ref<Resource | null>(null)
const selectedSlot = ref<TimeSlot | null>(null)
const email = ref<string>('')
const showModal = ref<boolean>(false)
const userEmail = ref<string>('user@naver.com')

const openPaymentModal = (slot: TimeSlot) => {
  selectedSlot.value = slot;
  showModal.value = true;
};

const getStatusText = (status: string) => {
  if (status === 'AVAILABLE') return '예약 가능';
  if (status === 'HOLD') return '결제 중';
  return '예약 완료';
};

const fetchResources = async () => {
  const res = await axios.get('/api/resources')
  console.log(res)
  resources.value = res.data

  console.log('데이터 로드 성공:', resources.value)
}

const fetchTimeSlots = async (resource: Resource) => {
  selectedResource.value = resource

  try {
    const res = await axios.get('/api/timeslots', {
      params: {
        resourceId: resource.id,
      },
    })
    timeslots.value = res.data
    console.log('데이터 로드 성공:', timeslots.value)

  } catch (error) {
    console.error('시간대 로드 실패:', error)
  }
}

const confirmReservation = async () => {
  if (!selectedSlot.value) return;

  try {
    // 1단계: 예약 생성 (HOLD 상태 유도)
    const res = await axios.post('/api/reservations', {
      timeSlotId: selectedSlot.value.id,
      userEmail: email.value || userEmail.value,
    });

    alert('예약(결제 대기)이 생성되었습니다.');
    showModal.value = false;

    // 이후 결제 로직으로 이동하거나 목록 새로고침
    if (selectedResource.value) {
      await fetchTimeSlots(selectedResource.value);
    }
  } catch (err: any) {
    alert('예약 실패: ' + (err.response?.data?.message || '알 수 없는 오류'));
  }
};

//시간만 추출 (예: 2024-05-20 09:00:00)
const formatTime = (dateTimeString?: string) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

//날짜만 추출 (예: 2024-05-20 09:00:00 -> 2024년 05월 20일)
const formatDate = (dateTimeString?: string) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.reservation-wrappper {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Pretendard', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

/* Resource Grid */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1xl));
  gap: 1rem;
}

.resource-item {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.resource-item:hover {
  border-color: #4dabf7;
}

.resource-item.active {
  background-color: #e7f5ff;
  border-color: #339af0;
  color: #1971c2;
  font-weight: bold;
}

/* Slot Style */
.slot-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1xl));
  gap: 0.75rem;
}

.slot-card {
  padding: 1rem;
  border-radius: 8px;
  background: #f1f3f5;
  text-align: center;
  cursor: pointer;
}

.slot-card.available:hover {
  background: #dee2e6;
}

.slot-card.reserved {
  background: #ffe3e3;
  color: #fa5252;
  cursor: not-allowed;
}

.slot-card.hold {
  background: #fff4e6;
  color: #fd7e14;
  cursor: wait;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.input-group {
  margin: 1.5rem 0;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-confirm {
  background: #339af0;
  color: white;
}

.btn-cancel {
  background: #adb5bd;
  color: white;
}

.reservation-container {
  max-width: 650px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif;
  color: #333;
}

h2 {
  text-align: center;
  color: #2d3436;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

h3 {
  font-size: 1rem;
  color: #636e72;
  margin-bottom: 12px;
}

section {
  margin-bottom: 25px;
}

/* 셀렉트 박스 디자인 */
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
}

select:focus {
  border-color: #0984e3;
}

/* 시간 슬롯 그리드 배치 */
.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

/* 시간 슬롯 버튼 스타일 */
.slot-grid button {
  padding: 15px 10px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 예약 가능 슬롯 호버 효과 */
.slot-grid button:not(:disabled):hover {
  background-color: #0984e3;
  color: white;
  border-color: #0984e3;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(9, 132, 227, 0.2);
}

/* 예약 불가능 슬롯 처리 */
.slot-grid button:disabled {
  background-color: #eee;
  color: #b2bec3;
  cursor: not-allowed;
  border-color: #dcdde1;
  text-decoration: line-through;
}

/* 모바일 대응 */
@media (max-width: 480px) {
  .reservation-container {
    margin: 20px;
    padding: 20px;
  }

  .slot-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
