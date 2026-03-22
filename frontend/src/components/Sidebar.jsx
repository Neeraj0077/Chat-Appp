// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { MessageSquarePlus, EllipsisVertical } from "lucide-react";
// import { Users } from "lucide-react";
// import { Search } from "lucide-react";
// import NewChat from "./NewChat";

// const Sidebar = () => {
//   const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
//   const { onlineUsers = [] } = useAuthStore();
//   const [showOnlineOnly, setShowOnlineOnly] = useState(false);
//   const [showNewChat, setShowNewChat] = useState(false);

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   const filteredUsers = showOnlineOnly
//     ? users.filter((user) => onlineUsers.includes(user._id))
//     : users;

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//       <div className="border-b border-base-300 w-full p-5">
//         <div className="flex justify-between  items-center gap-2">
//           <span className="text-xl font-bold hidden lg:block">Chats</span>
//           <div className="flex items-center gap-4">
//             <MessageSquarePlus className="cursor-pointer size-5" />
//             <EllipsisVertical className="cursor-pointer size-5" />
//           </div>
//         </div>

//         <div className="mt-4 hidden lg:flex w-full px-1 relative">
//           <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search or start a new chat"
//             className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-[#2a2d3e] border border-transparent hover:border-[#5754E8]/30 focus:outline-none focus:ring-2 focus:ring-[#5754E8] text-sm text-gray-300 font-medium"
//           />
//         </div>
//       </div>

//       <div className="overflow-y-auto w-full py-3">
//         {filteredUsers.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className={`
//               w-full p-3 flex items-center gap-3
//               hover:bg-base-300 transition-colors
//               ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
//             `}
//           >
//             <div className="relative mx-auto lg:mx-0">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.fullname}
//                 className="size-12 object-cover rounded-full"
//               />
//               {onlineUsers.includes(user._id) && (
//                 <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
//               )}
//             </div>

//             <div className="hidden lg:block text-left min-w-0">
//               <div className="font-medium truncate">{user.fullname}</div>
//               <div className="text-sm text-zinc-400">
//                 {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//               </div>
//             </div>
//           </button>
//         ))}

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-zinc-500 py-4">
//             {showOnlineOnly ? "No online users" : "No contacts found"}
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageSquarePlus, EllipsisVertical } from "lucide-react";
import { Users } from "lucide-react";
import { Search } from "lucide-react";
import NewChat from "./NewChat";

const Sidebar = () => {
  const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers = [] } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

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
          <div className="flex items-center gap-4">
            <MessageSquarePlus
              className="cursor-pointer size-5"
              onClick={() => setShowNewChat(true)}
            />
            <EllipsisVertical className="cursor-pointer size-5" />
          </div>
        </div>

        <div className="mt-4 hidden lg:flex w-full px-1 relative">
          <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-[#2a2d3e] border border-transparent hover:border-[#5754E8]/30 focus:outline-none focus:ring-2 focus:ring-[#5754E8] text-sm text-gray-300 font-medium"
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No contacts found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;