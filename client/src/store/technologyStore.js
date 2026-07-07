import { create } from "zustand";
import apiService from "../services/apiService";

const useTechnologyStore = create((set) => ({
  technologies: [],
  adminTechnologies: [],
  selectedTechnology: null,
  loading: false,
  error: null,

  fetchTechnologies: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/technologies");
      set({ technologies: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminTechnologies: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/technologies", { params });
      const technologies = data.data ?? [];
      set({ adminTechnologies: technologies, loading: false });
      return { items: technologies, pagination: data.pagination ?? { total: technologies.length, page: 1, pages: 1 } };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createTechnology: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/technologies/create", formData);
      set((state) => ({
        adminTechnologies: [...state.adminTechnologies, data.data],
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

  updateTechnology: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/technologies/${id}`, formData);
      set((state) => ({
        adminTechnologies: state.adminTechnologies.map((t) =>
          t._id === id ? data.data : t
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

  deleteTechnology: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/technologies/${id}`);
      set((state) => ({
        adminTechnologies: state.adminTechnologies.filter((t) => t._id !== id),
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

  deleteAllTechnologies: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/technologies");
      set({ adminTechnologies: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useTechnologyStore;
