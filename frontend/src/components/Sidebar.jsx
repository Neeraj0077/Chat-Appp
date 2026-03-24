import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import MessageStatus from "./Messagestatus";
import { MessageSquarePlus, EllipsisVertical, Search } from "lucide-react";
import NewChat from "./NewChat";
import FriendRequests from "./Friendrequests";

const Sidebar = () => {
  const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading, unreadCounts, lastMessages } = useChatStore();
  const { onlineUsers = [], socket, authUser } = useAuthStore();
  const { addIncomingRequest } = useFriendStore();
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (!socket) return;
    socket.on("friendRequestReceived", (user) => {
      addIncomingRequest(user);
    });
    socket.on("friendRequestAccepted", () => {
      getUsers();
    });
    return () => {
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
    };
  }, [socket]);

  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const getLastMsg = (user) => lastMessages[user._id] || user.lastMessage || null;

  const getPreviewText = (lastMsg) => {
    if (!lastMsg) return null;
    if (lastMsg.image && !lastMsg.text) return "📷 Photo";
    if (lastMsg.text) return lastMsg.text;
    return null;
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 relative">

      {showNewChat && (
        <NewChat
          onClose={() => setShowNewChat(false)}
          onSelectUser={setSelectedUser}
        />
      )}

      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xl font-bold hidden lg:block">Chats</span>
          <div className="flex items-center gap-2">
            <MessageSquarePlus
              className="cursor-pointer size-5"
              onClick={() => setShowNewChat(true)}
            />
            <FriendRequests />
            <EllipsisVertical className="cursor-pointer size-5" />
          </div>
        </div>

        <div className="mt-4 hidden lg:flex w-full px-1 relative">
          <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-[#2a2d3e] border border-transparent hover:border-[#5754E8]/30 focus:outline-none focus:ring-2 focus:ring-[#5754E8] text-sm text-gray-300 font-medium"
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user._id] || 0;
          const lastMsg = getLastMsg(user);
          const preview = getPreviewText(lastMsg);
          const lastMsgIsMine = lastMsg?.senderId?.toString() === authUser?._id?.toString();

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0 shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Name + last message */}
              <div className="hidden lg:flex flex-1 flex-col text-left min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-medium truncate ${unread > 0 ? "text-white" : ""}`}>
                    {user.fullname}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  {/* Tick + preview inline */}
                  <div className="flex items-center gap-1 min-w-0">
                    {lastMsgIsMine && lastMsg?.status && (
                      <span className="shrink-0">
                        <MessageStatus status={lastMsg.status} />
                      </span>
                    )}
                    {preview ? (
                      <span className={`text-xs truncate max-w-[140px] ${unread > 0 ? "text-white font-medium" : "text-zinc-400"}`}>
                        {preview}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 italic">No messages yet</span>
                    )}
                  </div>

                  {/* Unread badge */}
                  {unread > 0 && (
                    <span className="shrink-0 min-w-[20px] h-5 px-1.5 bg-[#5754E8] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile: unread dot only */}
              {unread > 0 && (
                <span className="lg:hidden absolute top-2 right-2 size-2.5 bg-[#5754E8] rounded-full" />
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm">
            No friends yet. Add some friends!
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;