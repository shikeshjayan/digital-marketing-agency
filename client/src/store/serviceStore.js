import { create } from "zustand";
import apiService from "../services/apiService";

const useServiceStore = create((set) => ({
  services: [],
  adminServices: [],
  selectedService: null,
  relatedServices: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/services");
      set({ services: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchServiceBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get(`/services/slug/${slug}`);
      set({ selectedService: data.data ?? null, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        selectedService: null,
      });
      return null;
    }
  },

  fetchRelatedServices: async (serviceId, limit = 3) => {
    try {
      const { data } = await apiService.get(`/services/related/${serviceId}`, {
        params: { limit },
      });
      set({ relatedServices: data.data ?? [] });
    } catch {
      set({ relatedServices: [] });
    }
  },

  fetchAdminServices: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/services", { params });
      const services = data.data ?? [];
      set({ adminServices: services, loading: false });
      return { items: services, pagination: data.pagination ?? { total: services.length, page: 1, pages: 1 } };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createService: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/services/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminServices: [...state.adminServices, data.data],
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

  updateService: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminServices: state.adminServices.map((s) =>
          s._id === id ? data.data : s
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

  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/services/${id}`);
      set((state) => ({
        adminServices: state.adminServices.filter((s) => s._id !== id),
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

  deleteAllServices: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/services");
      set({ adminServices: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useServiceStore;
