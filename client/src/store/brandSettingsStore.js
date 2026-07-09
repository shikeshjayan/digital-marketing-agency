import { create } from "zustand";
import apiService from "../services/apiService";

const useBrandSettingsStore = create((set) => ({
  content: null,
  loading: false,
  error: null,

  fetchBrandSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/brand-settings");
      set({ content: data.data ?? {}, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminBrandSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/brand-settings");
      set({ content: data.data ?? {}, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateBrandSettings: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put("/admin/brand-settings", payload);
      set({ content: data.data ?? payload, loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  seedBrandSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/brand-settings/seed");
      set({ content: data.data ?? {}, loading: false });
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

export default useBrandSettingsStore;
