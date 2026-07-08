import { create } from "zustand";
import apiService from "../services/apiService";

const useIndustryStore = create((set) => ({
  industries: [],
  adminIndustries: [],
  selectedIndustry: null,
  loading: false,
  error: null,

  fetchIndustries: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/industries");
      set({ industries: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminIndustries: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/industries", { params });
      const industries = data.data ?? [];
      set({ adminIndustries: industries, loading: false });
      return { items: industries, pagination: data.pagination ?? { total: industries.length, page: 1, pages: 1 } };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createIndustry: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/industries/create", formData);
      set((state) => ({
        adminIndustries: [...state.adminIndustries, data.data],
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

  updateIndustry: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/industries/${id}`, formData);
      set((state) => ({
        adminIndustries: state.adminIndustries.map((i) =>
          i._id === id ? data.data : i
        ),
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

  deleteIndustry: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/industries/${id}`);
      set((state) => ({
        adminIndustries: state.adminIndustries.filter((i) => i._id !== id),
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

  deleteAllIndustries: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/industries");
      set({ adminIndustries: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useIndustryStore;
