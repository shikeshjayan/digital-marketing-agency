import { create } from "zustand";
import apiService from "../services/apiService";

const useCourseStore = create((set) => ({
  courses: [],
  adminCourses: [],
  categories: [],
  selectedCourse: null,
  courseBySlug: null,
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

  fetchCourseBySlug: async (slug) => {
    set({ loading: true, error: null, courseBySlug: null });
    try {
      const { data } = await apiService.get(`/courses/slug/${slug}`);
      set({ courseBySlug: data.data ?? null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await apiService.get("/admin/courses/categories");
      set({ categories: data.data ?? [] });
      return data.data ?? [];
    } catch (error) {
      return [];
    }
  },

  fetchAdminCourses: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/courses", { params });
      const courses = data.data ?? [];
      set({ adminCourses: courses, loading: false });
      return courses;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  createCourse: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/courses/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const { data } = await apiService.put(`/admin/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  deleteAllCourses: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/courses");
      set({ adminCourses: [], loading: false });
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
