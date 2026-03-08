"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginUser, signupUser, updateUserProfile } from "./supabase-users"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  role: "user" | "admin"
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        try {
          const { user, error } = await loginUser(email, password)

          if (user) {
            set({
              user: user as User,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          }

          set({ isLoading: false })
          return { success: false, error: error || "Invalid credentials" }
        } catch (err) {
          console.error("Login error:", err)
          set({ isLoading: false })
          return { success: false, error: "Something went wrong" }
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true })

        try {
          const { user, error } = await signupUser(name, email, password)

          if (user) {
            set({
              user: user as User,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          }

          set({ isLoading: false })
          return { success: false, error: error || "Failed to create account" }
        } catch (err) {
          console.error("Signup error:", err)
          set({ isLoading: false })
          return { success: false, error: "Something went wrong" }
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      updateProfile: async (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          await updateUserProfile(currentUser.id, {
            name: updates.name,
            avatar: updates.avatar,
          })
          set({
            user: { ...currentUser, ...updates },
          })
        }
      },

      isAdmin: () => {
        const user = get().user
        return user?.role === "admin"
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
