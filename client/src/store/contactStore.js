import { create } from "zustand";
import apiService from "../services/apiService";

const useContactStore = create((set) => ({
  adminEnquiries: [],
  loading: false,
  error: null,
  success: false,

  submitContact: async (formData) => {
    set({ loading: true, error: null, success: false });
    try {
      await apiService.post("/contact/submit", formData);
      set({ loading: false, success: true });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminEnquiries: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/contact/enquiries", { params });
      const enquiries = data.data ?? [];
      set({ adminEnquiries: enquiries, loading: false });
      return { enquiries, counters: data.counters ?? null };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  updateEnquiryStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.patch(`/admin/contact/enquiries/status/${id}`, { status });
      set((state) => ({
        adminEnquiries: state.adminEnquiries.map((e) =>
          e.enquiry_id === id ? { ...e, status: data.data.status } : e
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

  deleteEnquiry: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/contact/enquiries/remove/${id}`);
      set((state) => ({
        adminEnquiries: state.adminEnquiries.filter((e) => e.enquiry_id !== id),
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

  deleteAllEnquiries: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/contact/enquiries");
      set({ adminEnquiries: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  reset: () => set({ error: null, success: false }),
}));

export default useContactStore;
