import { create } from "zustand";
import apiService from "../services/apiService";

const useServiceStore = create((set) => ({
  services: [],
  adminServices: [],
  selectedService: null,
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

  fetchAdminServices: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/services", { params });
      set({ adminServices: data.data ?? [], loading: false });
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
      const { data } = await apiService.post("/admin/services/create", formData);
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
      const { data } = await apiService.put(`/admin/services/${id}`, formData);
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
}));

export default useServiceStore;
