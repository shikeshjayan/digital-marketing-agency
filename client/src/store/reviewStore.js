import { create } from "zustand";
import apiService from "../services/apiService";

const useReviewStore = create((set) => ({
  reviews: [],
  adminReviews: [],
  selectedReview: null,
  loading: false,
  error: null,
  success: false,

  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/reviews");
      set({ reviews: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  submitReview: async (formData) => {
    set({ loading: true, error: null, success: false });
    try {
      await apiService.post("/reviews/submit", formData);
      set({ loading: false, success: true });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminReviews: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/reviews", { params });
      const reviews = data.data ?? [];
      set({ adminReviews: reviews, loading: false });
      return { reviews, counters: data.counters ?? null };
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  approveReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.patch(`/admin/reviews/approve/${id}`);
      set((state) => ({
        adminReviews: state.adminReviews.map((r) =>
          r._id === id ? { ...r, status: "Approved" } : r
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

  rejectReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.patch(`/admin/reviews/reject/${id}`);
      set((state) => ({
        adminReviews: state.adminReviews.map((r) =>
          r._id === id ? { ...r, status: "Rejected" } : r
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

  reset: () => set({ error: null, success: false }),
}));

export default useReviewStore;
