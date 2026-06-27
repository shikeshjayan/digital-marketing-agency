import { create } from "zustand";
import apiService from "../services/apiService";

const useProjectStore = create((set) => ({
  projects: [],
  adminProjects: [],
  categories: [],
  selectedProject: null,
  loading: false,
  error: null,

  fetchProjects: async (category) => {
    set({ loading: true, error: null });
    try {
      const params = category && category !== "All" ? { category } : {};
      const { data } = await apiService.get("/projects", { params });
      set({ projects: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await apiService.get("/admin/projects/categories");
      set({ categories: data.data ?? [] });
      return data.data ?? [];
    } catch (error) {
      return [];
    }
  },

  fetchAdminProjects: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/projects", { params });
      const projects = data.data ?? [];
      set({ adminProjects: projects, loading: false });
      return projects;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createProject: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/projects/create", formData);
      set((state) => ({
        adminProjects: [...state.adminProjects, data.data],
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

  updateProject: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/projects/${id}`, formData);
      set((state) => ({
        adminProjects: state.adminProjects.map((p) =>
          p._id === id ? data.data : p
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

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/projects/${id}`);
      set((state) => ({
        adminProjects: state.adminProjects.filter((p) => p._id !== id),
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
}));

export default useProjectStore;
