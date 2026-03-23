import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useFriendStore = create((set, get) => ({
    searchResults: [],
    friendRequests: [],  
    isSearching: false,
    isLoadingRequests: false,

    searchUsers: async (query) => {
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/friends/search?query=${query}`);
            set({ searchResults: res.data });
        } catch (err) {
            toast.error("Search failed");
        } finally {
            set({ isSearching: false });
        }
    },

    getFriendRequests: async () => {
        set({ isLoadingRequests: true });
        try {
            const res = await axiosInstance.get("/friends/requests");
            set({ friendRequests: res.data });
        } catch (err) {
            toast.error("Failed to load friend requests");
        } finally {
            set({ isLoadingRequests: false });
        }
    },

    sendFriendRequest: async (userId) => {
        try {
            await axiosInstance.post(`/friends/send/${userId}`);
 
            set((state) => ({
                searchResults: state.searchResults.map((u) =>
                    u._id === userId ? { ...u, status: "sent" } : u
                ),
            }));
            toast.success("Friend request sent!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to send request");
        }
    },

    acceptFriendRequest: async (userId) => {
        try {
            await axiosInstance.post(`/friends/accept/${userId}`);
            set((state) => ({
                friendRequests: state.friendRequests.filter((u) => u._id !== userId),
            }));
            toast.success("Friend request accepted!");
            
            useAuthStore.getState().refreshFriends?.();
        } catch (err) {
            toast.error("Failed to accept request");
        }
    },

    declineFriendRequest: async (userId) => {
        try {
            await axiosInstance.post(`/friends/decline/${userId}`);
            set((state) => ({
                friendRequests: state.friendRequests.filter((u) => u._id !== userId),
            }));
            toast.success("Request declined");
        } catch (err) {
            toast.error("Failed to decline request");
        }
    },

    cancelFriendRequest: async (userId) => {
        try {
            await axiosInstance.post(`/friends/cancel/${userId}`);
            set((state) => ({
                searchResults: state.searchResults.map((u) =>
                    u._id === userId ? { ...u, status: "none" } : u
                ),
            }));
            toast.success("Request cancelled");
        } catch (err) {
            toast.error("Failed to cancel request");
        }
    },
 
    addIncomingRequest: (user) => {
        set((state) => ({
            friendRequests: [...state.friendRequests, user],
        }));
    },
}));