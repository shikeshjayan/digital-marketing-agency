import { create } from "zustand";
import apiService from "../services/apiService";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/login", credentials);
      set({ user: data.data ?? null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/register", formData);
      set({ user: data.data ?? null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.post("/admin/logout");
      set({ user: null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/profile");
      set({ user: data.data ?? null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  resetUser: () => set({ user: null, error: null }),
}));

export default useAuthStore;
