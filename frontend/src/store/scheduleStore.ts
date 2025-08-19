import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimeSlot {
  time: string;
  status: "available" | "busy" | "selected";
}

interface Schedule {
  date: string;
  timeSlots: TimeSlot[];
}

interface ScheduleState {
  schedules: Schedule[];
  selectedDate: string | null;
  selectedTimeSlots: string[];

  // Actions
  addSchedule: (date: string, timeSlots: TimeSlot[]) => void;
  updateSchedule: (date: string, timeSlots: TimeSlot[]) => void;
  getSchedule: (date: string) => Schedule | null;
  selectTimeSlot: (date: string, time: string) => void;
  deselectTimeSlot: (date: string, time: string) => void;
  clearSelectedTimeSlots: () => void;
  setSelectedDate: (date: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      selectedDate: null,
      selectedTimeSlots: [],

      addSchedule: (date: string, timeSlots: TimeSlot[]) => {
        const { schedules } = get();
        const existingIndex = schedules.findIndex((s) => s.date === date);

        if (existingIndex >= 0) {
          // 기존 스케줄 업데이트
          const updatedSchedules = [...schedules];
          updatedSchedules[existingIndex] = { date, timeSlots };
          set({ schedules: updatedSchedules });
        } else {
          // 새 스케줄 추가
          set({ schedules: [...schedules, { date, timeSlots }] });
        }
      },

      updateSchedule: (date: string, timeSlots: TimeSlot[]) => {
        const { schedules } = get();
        const updatedSchedules = schedules.map((schedule) =>
          schedule.date === date ? { ...schedule, timeSlots } : schedule
        );
        set({ schedules: updatedSchedules });
      },

      getSchedule: (date: string) => {
        const { schedules } = get();
        return schedules.find((s) => s.date === date) || null;
      },

      selectTimeSlot: (date: string, time: string) => {
        const { selectedTimeSlots } = get();
        const key = `${date}-${time}`;
        if (!selectedTimeSlots.includes(key)) {
          set({ selectedTimeSlots: [...selectedTimeSlots, key] });
        }
      },

      deselectTimeSlot: (date: string, time: string) => {
        const { selectedTimeSlots } = get();
        const key = `${date}-${time}`;
        set({
          selectedTimeSlots: selectedTimeSlots.filter((slot) => slot !== key),
        });
      },

      clearSelectedTimeSlots: () => {
        set({ selectedTimeSlots: [] });
      },

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({
        schedules: state.schedules,
      }),
    }
  )
);
