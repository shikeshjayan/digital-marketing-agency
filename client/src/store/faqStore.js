import { create } from "zustand";
import apiService from "../services/apiService";

const useFaqStore = create((set) => ({
  faqs: [],
  adminFaqs: [],
  loading: false,
  error: null,

  fetchFAQsByService: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get(`/faqs/service/${serviceId}`);
      set({ faqs: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchFAQs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/faqs");
      set({ faqs: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminFAQs: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/faqs", { params });
      const faqs = data.data ?? [];
      set({ adminFaqs: faqs, loading: false });
      return { items: faqs, pagination: data.pagination ?? { total: faqs.length, page: 1, pages: 1 } };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createFAQ: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/faqs/create", formData);
      set((state) => ({
        adminFaqs: [...state.adminFaqs, data.data],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  updateFAQ: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/faqs/${id}`, formData);
      set((state) => ({
        adminFaqs: state.adminFaqs.map((f) => (f._id === id ? data.data : f)),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  deleteFAQ: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/faqs/${id}`);
      set((state) => ({
        adminFaqs: state.adminFaqs.filter((f) => f._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  deleteAllFAQs: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/faqs");
      set({ adminFaqs: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useFaqStore;
