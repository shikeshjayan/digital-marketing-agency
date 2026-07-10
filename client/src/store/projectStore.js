import { create } from "zustand";
import apiService from "../services/apiService";

const useProjectStore = create((set) => ({
  projects: [],
  adminProjects: [],
  selectedProject: null,
  relatedProjects: [],
  loading: false,
  error: null,

  fetchProjects: async (service) => {
    set({ loading: true, error: null });
    try {
      const params = service && service !== "All" ? { service } : {};
      const { data } = await apiService.get("/projects", { params });
      set({ projects: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchRelatedProjects: async (serviceId, limit = 3) => {
    try {
      const { data } = await apiService.get("/projects", { params: { service: serviceId, limit } });
      set({ relatedProjects: data.data ?? [] });
    } catch {
      set({ relatedProjects: [] });
    }
  },

  fetchProjectById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get(`/projects/${id}`);
      set({ selectedProject: data.data ?? null, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        selectedProject: null,
      });
      return null;
    }
  },

  fetchProjectBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get(`/projects/slug/${slug}`);
      set({ selectedProject: data.data ?? null, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        selectedProject: null,
      });
      return null;
    }
  },

  fetchAdminProjects: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/projects", { params });
      const projects = data.data ?? [];
      set({ adminProjects: projects, loading: false });
      return { items: projects, pagination: data.pagination ?? { total: projects.length, page: 1, pages: 1 } };
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
      const { data } = await apiService.post("/admin/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const { data } = await apiService.put(`/admin/projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  deleteAllProjects: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/projects");
      set({ adminProjects: [], loading: false });
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
