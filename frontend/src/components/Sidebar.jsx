import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import MessageStatus from "./Messagestatus";
import { MessageSquarePlus, EllipsisVertical, Search, FileX } from "lucide-react";
import NewChat from "./NewChat";
import FriendRequests from "./Friendrequests";
import VerticalElipseModal from "./VerticalElipseModal";
import { formatMessageTime, formatMesasgeDate } from "../lib/utils";

const Sidebar = () => {
  const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading, unreadCounts, lastMessages, typingUsers } = useChatStore();
  const { onlineUsers = [], socket, authUser } = useAuthStore();
  const { addIncomingRequest } = useFriendStore();
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { getUsers(); }, [getUsers]);

  useEffect(() => {
    if (!socket) return;
    socket.on("friendRequestReceived", (user) => addIncomingRequest(user));
    socket.on("friendRequestAccepted", () => getUsers());
    return () => {
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
    };
  }, [socket]);

  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase()) //first convert the username to lowercase and then convert 'user types word to lowercase' and using includes method perfom a search.
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
        <NewChat onClose={() => setShowNewChat(false)} onSelectUser={setSelectedUser} />
      )}

      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xl font-bold hidden lg:block">Chats</span>
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="cursor-pointer size-5" onClick={() => setShowNewChat(true)} />
            <FriendRequests />
            <EllipsisVertical className="cursor-pointer size-5" onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>

        <div className="mt-4 hidden lg:flex w-full px-1 relative">
          <Search className="absolute left-3 top-2.5 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-base-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user._id] || 0;
          const lastMsg = getLastMsg(user);
          const preview = getPreviewText(lastMsg);
          const lastMsgIsMine = lastMsg?.senderId?.toString() === authUser?._id?.toString();
          const isUserTyping = typingUsers?.[user._id] || false;

          console.log(lastMsg);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-200 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0 shrink-0 cursor-pointer">
                <img
                  src={user.profilePic || "https://res.cloudinary.com/dpq0wpobg/image/upload/v1775223227/person_fn8yct.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-primary rounded-full ring-2 ring-base-100" />
                )}
                
              </div>

              <div className="hidden lg:flex flex-1 flex-col text-left min-w-0 cursor-pointer">
                <div className="">
                  <span className={`font-medium truncate ${unread > 0 ? "text-base-content" : ""} flex items-center justify-between`}>
                    {user.fullname}
                    <span className="text-[10px] text-base-content/40 text-right">{!lastMsg || formatMesasgeDate(lastMsg?.createdAt)}</span>
                  </span>
                </div>
 

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                    {isUserTyping ? (
                      <span className="text-xs text-primary font-medium">typing...</span>
                    ) : (
                      <>
                        {lastMsgIsMine && lastMsg?.status && (
                          <span className="shrink-0">
                            <MessageStatus status={lastMsg.status} />
                          </span>
                        )}
                        {preview ? (
                          <span className={`text-xs truncate max-w-35 ${unread > 0 ? "text-base-content font-medium" : "text-base-content/50"}`}>
                            {preview}
                          </span>
                        ) : (
                          <span className="text-xs text-base-content/30 italic">No messages yet</span>
                        )}
                      </>
                    )}
                  </div>

                  {unread > 0 && !isUserTyping && (
                    <span className="shrink-0 min-w-5 h-5 px-1.5 bg-primary text-primary-content text-[11px] font-bold rounded-full flex items-center justify-center">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </div>
              </div>

              {unread > 0 && (
                <span className="lg:hidden absolute top-2 right-2 size-2.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/40 py-4 text-sm">
            No friends yet. Add some friends!
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;


// import { useEffect, useState, useRef } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import { useFriendStore } from "../store/useFriendStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import MessageStatus from "./Messagestatus";
// import { MessageSquarePlus, EllipsisVertical, Search, X, Trash2, Archive, BellOff } from "lucide-react";
// import NewChat from "./NewChat";
// import FriendRequests from "./Friendrequests";

// const Sidebar = () => {
//   const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading, unreadCounts, lastMessages, typingUsers } = useChatStore();
//   const { onlineUsers = [], socket, authUser } = useAuthStore();
//   const { addIncomingRequest } = useFriendStore();
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [search, setSearch] = useState("");
//   const [showMenu, setShowMenu] = useState(false);
//   const [selectMode, setSelectMode] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const menuRef = useRef(null);

//   useEffect(() => { getUsers(); }, [getUsers]);

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("friendRequestReceived", (user) => addIncomingRequest(user));
//     socket.on("friendRequestAccepted", () => getUsers());
//     return () => {
//       socket.off("friendRequestReceived");
//       socket.off("friendRequestAccepted");
//     };
//   }, [socket]);

//   // Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredUsers = users.filter((user) =>
//     user.fullname?.toLowerCase().includes(search.toLowerCase())
//   );

//   const getLastMsg = (user) => lastMessages[user._id] || user.lastMessage || null;

//   const getPreviewText = (lastMsg) => {
//     if (!lastMsg) return null;
//     if (lastMsg.image && !lastMsg.text) return "📷 Photo";
//     if (lastMsg.text) return lastMsg.text;
//     return null;
//   };

//   const handleSelectMode = () => {
//     setShowMenu(false);
//     setSelectMode(true);
//     setSelectedUsers([]);
//   };

//   const handleCancelSelect = () => {
//     setSelectMode(false);
//     setSelectedUsers([]);
//   };

//   const toggleUserSelect = (userId) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
//     );
//   };

//   const handleUserClick = (user) => {
//     if (selectMode) {
//       toggleUserSelect(user._id);
//     } else {
//       setSelectedUser(user);
//     }
//   };

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 relative">

//       {showNewChat && (
//         <NewChat onClose={() => setShowNewChat(false)} onSelectUser={setSelectedUser} />
//       )}

//       <div className="border-b border-base-300 w-full p-5">
//         {selectMode ? (
//           <div className="flex justify-between items-center gap-2">
//             <button onClick={handleCancelSelect} className="p-1 rounded-full hover:bg-base-200">
//               <X className="size-5" />
//             </button>
//             <span className="text-sm font-medium hidden lg:block">
//               {selectedUsers.length === 0 ? "Select users" : `${selectedUsers.length} selected`}
//             </span>
//             <div className="flex items-center gap-3 ml-auto">
//               {selectedUsers.length > 0 && (
//                 <>
//                   <button title="Mute" className="cursor-pointer hover:opacity-70" onClick={() => {}}>
//                     <BellOff className="size-5" />
//                   </button>
//                   <button title="Archive" className="cursor-pointer hover:opacity-70" onClick={() => {}}>
//                     <Archive className="size-5" />
//                   </button>
//                   <button title="Delete" className="cursor-pointer text-error hover:opacity-70" onClick={() => {}}>
//                     <Trash2 className="size-5" />
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex justify-between items-center gap-2">
//             <span className="text-xl font-bold hidden lg:block">Chats</span>
//             <div className="flex items-center gap-2">
//               <MessageSquarePlus className="cursor-pointer size-5" onClick={() => setShowNewChat(true)} />
//               <FriendRequests />
//               <div className="relative" ref={menuRef}>
//                 <EllipsisVertical
//                   className="cursor-pointer size-5"
//                   onClick={() => setShowMenu((prev) => !prev)}
//                 />
//                 {showMenu && (
//                   <div className="absolute right-0 top-7 z-50 bg-base-100 border border-base-300 rounded-xl shadow-lg w-48 py-1 overflow-hidden">
//                     <button
//                       className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
//                       onClick={handleSelectMode}
//                     >
//                       Select users
//                     </button>
//                     <button
//                       className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
//                       onClick={() => setShowMenu(false)}
//                     >
//                       New group
//                     </button>
//                     <button
//                       className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
//                       onClick={() => setShowMenu(false)}
//                     >
//                       Archived chats
//                     </button>
//                     <button
//                       className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
//                       onClick={() => setShowMenu(false)}
//                     >
//                       Settings
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mt-4 hidden lg:flex w-full px-1 relative">
//           <Search className="absolute left-3 top-2.5 size-4 text-base-content/40" />
//           <input
//             type="text"
//             placeholder="Search conversations"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-base-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
//           />
//         </div>
//       </div>

//       <div className="overflow-y-auto w-full py-3">
//         {filteredUsers.map((user) => {
//           const unread = unreadCounts[user._id] || 0;
//           const lastMsg = getLastMsg(user);
//           const preview = getPreviewText(lastMsg);
//           const lastMsgIsMine = lastMsg?.senderId?.toString() === authUser?._id?.toString();
//           const isUserTyping = typingUsers?.[user._id] || false;
//           const isChecked = selectedUsers.includes(user._id);

//           return (
//             <button
//               key={user._id}
//               onClick={() => handleUserClick(user)}
//               className={`
//                 w-full p-3 flex items-center gap-3
//                 hover:bg-base-200 transition-colors
//                 ${!selectMode && selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-base-300" : ""}
//                 ${selectMode && isChecked ? "bg-base-200" : ""}
//               `}
//             >
//               {selectMode && (
//                 <div className="hidden lg:flex shrink-0 items-center justify-center">
//                   <div
//                     className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
//                       isChecked ? "bg-primary border-primary" : "border-base-content/30"
//                     }`}
//                   >
//                     {isChecked && (
//                       <svg className="size-3 text-primary-content" viewBox="0 0 12 12" fill="none">
//                         <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="relative mx-auto lg:mx-0 shrink-0">
//                 <img
//                   src={user.profilePic || "/avatar.png"}
//                   alt={user.fullname}
//                   className={`size-12 object-cover rounded-full transition-all ${selectMode && isChecked ? "opacity-80" : ""}`}
//                 />
//                 {!selectMode && onlineUsers.includes(user._id) && (
//                   <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
//                 )}
//                 {selectMode && isChecked && (
//                   <span className="lg:hidden absolute bottom-0 right-0 size-4 bg-primary rounded-full ring-2 ring-base-100 flex items-center justify-center">
//                     <svg className="size-2.5 text-primary-content" viewBox="0 0 12 12" fill="none">
//                       <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </span>
//                 )}
//               </div>

//               <div className="hidden lg:flex flex-1 flex-col text-left min-w-0">
//                 <div className="flex items-center justify-between">
//                   <span className={`font-medium truncate ${unread > 0 ? "text-base-content" : ""}`}>
//                     {user.fullname}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between gap-2 mt-0.5">
//                   <div className="flex items-center gap-1 min-w-0">
//                     {isUserTyping ? (
//                       <span className="text-xs text-primary font-medium">typing...</span>
//                     ) : (
//                       <>
//                         {lastMsgIsMine && lastMsg?.status && (
//                           <span className="shrink-0">
//                             <MessageStatus status={lastMsg.status} />
//                           </span>
//                         )}
//                         {preview ? (
//                           <span className={`text-xs truncate max-w-35 ${unread > 0 ? "text-base-content font-medium" : "text-base-content/50"}`}>
//                             {preview}
//                           </span>
//                         ) : (
//                           <span className="text-xs text-base-content/30 italic">No messages yet</span>
//                         )}
//                       </>
//                     )}
//                   </div>

//                   {!selectMode && unread > 0 && !isUserTyping && (
//                     <span className="shrink-0 min-w-5 h-5 px-1.5 bg-primary text-primary-content text-[11px] font-bold rounded-full flex items-center justify-center">
//                       {unread > 99 ? "99+" : unread}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {!selectMode && unread > 0 && (
//                 <span className="lg:hidden absolute top-2 right-2 size-2.5 bg-primary rounded-full" />
//               )}
//             </button>
//           );
//         })}

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-base-content/40 py-4 text-sm">
//             No friends yet. Add some friends!
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;