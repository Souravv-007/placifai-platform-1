import { create } from 'zustand'
 
const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
 
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
 
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, error: null })
  },
}))
 
export default useAuthStore
 
