import { create } from "zustand";
import apiService from "../services/apiService";

const useSiteContentStore = create((set) => ({
  content: null,
  loading: false,
  error: null,

  fetchSiteContent: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/site-content");
      set({ content: data.data ?? {}, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateSiteContent: async (content) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put("/admin/site-content", { content });
      set({ content: data.data ?? content, loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  seedSiteContent: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/site-content/seed");
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

export default useSiteContentStore;
