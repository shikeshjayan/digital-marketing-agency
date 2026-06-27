import { create } from "zustand";
import apiService from "../services/apiService";

const useCourseStore = create((set) => ({
  courses: [],
  adminCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/courses");
      set({ courses: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminCourses: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/courses", { params });
      set({ adminCourses: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createCourse: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/courses/create", formData);
      set((state) => ({
        adminCourses: [...state.adminCourses, data.data],
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

  updateCourse: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/courses/${id}`, formData);
      set((state) => ({
        adminCourses: state.adminCourses.map((c) =>
          c._id === id ? data.data : c
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

  deleteCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/courses/${id}`);
      set((state) => ({
        adminCourses: state.adminCourses.filter((c) => c._id !== id),
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

export default useCourseStore;
