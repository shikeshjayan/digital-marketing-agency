import { create } from "zustand";
import apiService from "../services/apiService";

const useCaseStudyStore = create((set) => ({
  caseStudies: [],
  adminCaseStudies: [],
  selectedCaseStudy: null,
  loading: false,
  error: null,

  fetchCaseStudies: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/case-studies", { params });
      set({ caseStudies: data.data ?? [], loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchCaseStudiesByService: async (serviceId) => {
    try {
      const { data } = await apiService.get(`/case-studies/service/${serviceId}`);
      return data.data ?? [];
    } catch {
      return [];
    }
  },

  fetchCaseStudyBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get(`/case-studies/slug/${slug}`);
      set({ selectedCaseStudy: data.data ?? null, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        selectedCaseStudy: null,
      });
      return null;
    }
  },

  fetchAdminCaseStudies: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/case-studies", { params });
      const caseStudies = data.data ?? [];
      set({ adminCaseStudies: caseStudies, loading: false });
      return { items: caseStudies, pagination: data.pagination ?? { total: caseStudies.length, page: 1, pages: 1 } };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createCaseStudy: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/case-studies/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminCaseStudies: [...state.adminCaseStudies, data.data],
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

  updateCaseStudy: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/case-studies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminCaseStudies: state.adminCaseStudies.map((cs) =>
          cs._id === id ? data.data : cs
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

  deleteCaseStudy: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/case-studies/${id}`);
      set((state) => ({
        adminCaseStudies: state.adminCaseStudies.filter((cs) => cs._id !== id),
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

  deleteAllCaseStudies: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/case-studies");
      set({ adminCaseStudies: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useCaseStudyStore;
