import { create } from "zustand";
import apiService from "../services/apiService";

const usePageStore = create((set) => ({
  servicesPage: null,
  projectsPage: null,
  homePage: null,
  aboutPage: null,
  testimonialsPage: null,
  contactPage: null,
  loading: false,
  error: null,

  fetchPageServices: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/page/services");
      set({ servicesPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchPageProjects: async (service) => {
    set({ loading: true, error: null });
    try {
      const params = service && service !== "All" ? { service } : {};
      const { data } = await apiService.get("/page/projects", { params });
      set({ projectsPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchPageHome: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/page/home");
      set({ homePage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchPageAbout: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/page/about");
      set({ aboutPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchPageTestimonials: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/page/testimonials");
      set({ testimonialsPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchPageContact: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/page/contact");
      set({ contactPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },
}));

export default usePageStore;
