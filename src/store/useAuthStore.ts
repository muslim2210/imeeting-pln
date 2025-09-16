"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/model";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData: User) =>
        set({
          user: userData,
          token: userData.token, // pastikan object User ada field token
        }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "pln_auth", // disimpan di localStorage
    }
  )
);
