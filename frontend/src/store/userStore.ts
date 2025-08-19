import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      setToken: (token: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, token },
            isAuthenticated: true,
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // 실제 API 호출로 대체
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("로그인에 실패했습니다.");
          }

          const data = await response.json();

          set({
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              token: data.token,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "로그인에 실패했습니다.",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "user-storage", // localStorage에 저장될 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // localStorage에 저장할 상태만 선택
    }
  )
);
