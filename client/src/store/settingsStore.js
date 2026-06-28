import { create } from "zustand";
import apiService from "../services/apiService";

const useSettingsStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/profile");
      const profile = data.data ?? null;
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  updateProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profile = data.data ?? null;
      set({ profile, loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useSettingsStore;
