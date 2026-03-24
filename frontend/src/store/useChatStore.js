// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   unreadCounts: {},   // { userId: count }
//   lastMessages: {},   // { userId: { text, image, createdAt } }

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       const users = Array.isArray(res.data) ? res.data : res.data.users || [];

//       const lastMessages = {};
//       users.forEach((u) => {
//         if (u.lastMessage) {
//           lastMessages[u._id] = u.lastMessage;
//         }
//       });

//       const sorted = [...users].sort((a, b) => {
//         const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
//         const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
//         return bTime - aTime;
//       });

//       set({ users: sorted, lastMessages });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to load users");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       const messages = Array.isArray(res.data) ? res.data : res.data.messages || [];
//       set({ messages });

//       // Clear unread count when opening chat
//       set((state) => ({
//         unreadCounts: { ...state.unreadCounts, [userId]: 0 },
//       }));
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to load messages");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       const newMessage = res.data;
//       set({ messages: [...messages, newMessage] });
//       get()._updateLastMessageAndSort(selectedUser._id, newMessage);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send message");
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       const isFromSelectedUser = newMessage.senderId === selectedUser._id;

//       if (isFromSelectedUser) {
//         set({ messages: [...get().messages, newMessage] });
//       } else {
//         set((state) => ({
//           unreadCounts: {
//             ...state.unreadCounts,
//             [newMessage.senderId]: (state.unreadCounts[newMessage.senderId] || 0) + 1,
//           },
//         }));
//       }

//       get()._updateLastMessageAndSort(newMessage.senderId, newMessage);
//     });

//     // When the receiver opens our chat → mark all our messages as seen
//     socket.on("messagesSeen", ({ by }) => {
//       const { selectedUser } = get();
//       if (selectedUser && by === selectedUser._id) {
//         // Update all sent messages in current chat to "seen"
//         set((state) => ({
//           messages: state.messages.map((msg) =>
//             msg.status !== "seen" ? { ...msg, status: "seen" } : msg
//           ),
//         }));
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//     socket.off("messagesSeen");
//   },

//   // Internal helper — update lastMessages map and re-sort users
//   _updateLastMessageAndSort: (userId, message) => {
//     set((state) => {
//       const updatedLastMessages = {
//         ...state.lastMessages,
//         [userId]: {
//           text: message.text,
//           image: message.image,
//           createdAt: message.createdAt,
//           status: message.status,
//         },
//       };

//       const sorted = [...state.users].sort((a, b) => {
//         const aTime = updatedLastMessages[a._id]?.createdAt
//           ? new Date(updatedLastMessages[a._id].createdAt)
//           : new Date(0);
//         const bTime = updatedLastMessages[b._id]?.createdAt
//           ? new Date(updatedLastMessages[b._id].createdAt)
//           : new Date(0);
//         return bTime - aTime;
//       });

//       return { lastMessages: updatedLastMessages, users: sorted };
//     });
//   },

//   setSelectedUser: (selectedUser) => {
//     set({ selectedUser });
//     if (selectedUser) {
//       set((state) => ({
//         unreadCounts: { ...state.unreadCounts, [selectedUser._id]: 0 },
//       }));
//     }
//   },
// }));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},
  lastMessages: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const users = Array.isArray(res.data) ? res.data : res.data.users || [];

      const lastMessages = {};
      users.forEach((u) => {
        if (u.lastMessage) {
          lastMessages[u._id] = u.lastMessage;
        }
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

    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;

      if (isFromSelectedUser) {
        // Chat is open — add message and immediately mark as seen
        const seenMessage = { ...newMessage, status: "seen" };
        set({ messages: [...get().messages, seenMessage] });

        // Tell backend + sender that message was seen instantly
        axiosInstance.get(`/messages/${selectedUser._id}`).catch(() => {});

      } else {
        // Chat is not open — increment unread
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]: (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
      }

      get()._updateLastMessageAndSort(newMessage.senderId, newMessage);
    });

    // When receiver sees our messages → update all to seen in UI
    socket.on("messagesSeen", ({ by }) => {
      const { selectedUser } = get();
      if (selectedUser && by === selectedUser._id) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.status !== "seen" ? { ...msg, status: "seen" } : msg
          ),
        }));

        // Also update the lastMessages tick in sidebar to seen
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
          ? new Date(updatedLastMessages[a._id].createdAt)
          : new Date(0);
        const bTime = updatedLastMessages[b._id]?.createdAt
          ? new Date(updatedLastMessages[b._id].createdAt)
          : new Date(0);
        return bTime - aTime;
      });

      return { lastMessages: updatedLastMessages, users: sorted };
    });
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [selectedUser._id]: 0 },
      }));
    }
  },
}));