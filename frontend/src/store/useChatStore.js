import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useSound } from "../hooks/useSound";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},
  lastMessages: {},
  isTyping: false,        // for current open chat indicator (dots in chat)
  typingUsers: {},        // { userId: true/false } — for sidebar "typing..."

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const users = Array.isArray(res.data) ? res.data : res.data.users || [];

      const lastMessages = {};
      users.forEach((u) => {
        if (u.lastMessage) lastMessages[u._id] = u.lastMessage;
      });

      const sorted = [...users].sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
        const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
        return bTime - aTime;
      });

      set({ users: sorted, lastMessages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const messages = Array.isArray(res.data) ? res.data : res.data.messages || [];
      set({ messages });
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [userId]: 0 },
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const newMessage = res.data;
      set({ messages: [...messages, newMessage] });
      get()._updateLastMessageAndSort(selectedUser._id, newMessage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const { playMessageSound } = useSound();

    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;

      if (isFromSelectedUser) {
        const seenMessage = { ...newMessage, status: "seen" };
        set((state) => ({
          messages: [...state.messages, seenMessage],
          isTyping: false,
          typingUsers: { ...state.typingUsers, [newMessage.senderId]: false },
        }));
        playMessageSound();
        axiosInstance.get(`/messages/${selectedUser._id}`).catch(() => {});
      } else {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]: (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
          typingUsers: { ...state.typingUsers, [newMessage.senderId]: false },
        }));
        playMessageSound();
      }

      get()._updateLastMessageAndSort(newMessage.senderId, newMessage);
    });

    socket.on("typing", ({ from }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [from]: true },
        isTyping: from === get().selectedUser?._id ? true : state.isTyping,
      }));
    });

    socket.on("stopTyping", ({ from }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [from]: false },
        isTyping: from === get().selectedUser?._id ? false : state.isTyping,
      }));
    });

    socket.on("messagesSeen", ({ by }) => {
      const { selectedUser } = get();
      if (selectedUser && by === selectedUser._id) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.status !== "seen" ? { ...msg, status: "seen" } : msg
          ),
        }));
        const { lastMessages } = get();
        const lastMsg = lastMessages[selectedUser._id];
        if (lastMsg) {
          get()._updateLastMessageAndSort(selectedUser._id, {
            ...lastMsg,
            status: "seen",
          });
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesSeen");
    socket.off("typing");
    socket.off("stopTyping");
    set({ isTyping: false });
  },

  _updateLastMessageAndSort: (userId, message) => {
    set((state) => {
      const updatedLastMessages = {
        ...state.lastMessages,
        [userId]: {
          text: message.text,
          image: message.image,
          createdAt: message.createdAt,
          status: message.status,
          senderId: message.senderId,
        },
      };

      const sorted = [...state.users].sort((a, b) => {
        const aTime = updatedLastMessages[a._id]?.createdAt
          ? new Date(updatedLastMessages[a._id].createdAt) : new Date(0);
        const bTime = updatedLastMessages[b._id]?.createdAt
          ? new Date(updatedLastMessages[b._id].createdAt) : new Date(0);
        return bTime - aTime;
      });

      return { lastMessages: updatedLastMessages, users: sorted };
    });
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, isTyping: false });
    if (selectedUser) {
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [selectedUser._id]: 0 },
      }));
    }
  },
}));