import { create } from "zustand";
import apiService from "../services/apiService";

const useTeamStore = create((set) => ({
  team: [],
  adminTeam: [],
  selectedMember: null,
  loading: false,
  error: null,

  fetchTeam: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/team");
      set({ team: data.data ?? [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAdminTeam: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.get("/admin/team", { params });
      const team = data.data ?? [];
      set({ adminTeam: team, loading: false });
      return team;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createMember: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.post("/admin/team/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminTeam: [...state.adminTeam, data.data],
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

  updateMember: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiService.put(`/admin/team/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        adminTeam: state.adminTeam.map((m) =>
          m._id === id ? data.data : m
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

  deleteMember: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/admin/team/${id}`);
      set((state) => ({
        adminTeam: state.adminTeam.filter((m) => m._id !== id),
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

  deleteAllMembers: async () => {
    set({ loading: true, error: null });
    try {
      await apiService.delete("/admin/team");
      set({ adminTeam: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useTeamStore;
