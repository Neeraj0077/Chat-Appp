// import { useEffect, useRef, useState } from "react";
// import { Bell, Check, X } from "lucide-react";
// import { useFriendStore } from "../store/useFriendStore";
// import { useChatStore } from "../store/useChatStore";

// const FriendRequests = () => {
//     const { friendRequests, getFriendRequests, acceptFriendRequest, declineFriendRequest } = useFriendStore();
//     const { getUsers } = useChatStore();
//     const [open, setOpen] = useState(false);
//     const panelRef = useRef(null);

//     useEffect(() => {
//         getFriendRequests();
//     }, []);

//     useEffect(() => {
//         const handleClick = (e) => {
//             if (panelRef.current && !panelRef.current.contains(e.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClick);
//         return () => document.removeEventListener("mousedown", handleClick);
//     }, []);

//     const handleAccept = async (userId) => {
//         await acceptFriendRequest(userId);
//         getUsers();
//     };

//     return (
//         <div className="relative" ref={panelRef}>

//             <button
//                 onClick={() => setOpen((prev) => !prev)}
//                 className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
//             >
//                 <Bell className="size-5 cursor-pointer" />
//                 {friendRequests.length > 0 && (
//                     <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//                         {friendRequests.length > 9 ? "9+" : friendRequests.length}
//                     </span>
//                 )}
//             </button>


//             {open && (
//                 <div className="absolute left-0 top-10 w-80 bg-[#1e2130] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
//                     <div className="p-4 border-b border-white/10">
//                         <h3 className="font-semibold text-white text-sm">Friend Requests</h3>
//                         {friendRequests.length > 0 && (
//                             <p className="text-xs text-zinc-400 mt-0.5">{friendRequests.length} pending</p>
//                         )}
//                     </div>

//                     <div className="max-h-72 overflow-y-auto">
//                         {friendRequests.length === 0 ? (
//                             <div className="text-center text-zinc-500 py-8 text-sm">
//                                 No pending requests
//                             </div>
//                         ) : (
//                             friendRequests.map((user) => (
//                                 <div
//                                     key={user._id}
//                                     className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
//                                 >
//                                     <img
//                                         src={user.profilePic || "/avatar.png"}
//                                         alt={user.fullname}
//                                         className="size-10 rounded-full object-cover shrink-0"
//                                     />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-gray-200 truncate">{user.fullname}</p>
//                                         <p className="text-xs text-zinc-500 truncate">{user.email}</p>
//                                     </div>
//                                     <div className="flex gap-1.5 shrink-0">
//                                         <button
//                                             onClick={() => handleAccept(user._id)}
//                                             className="size-8 rounded-full bg-[#5754E8] hover:bg-[#4a47d4] flex items-center justify-center transition-colors"
//                                             title="Accept"
//                                         >
//                                             <Check className="size-4 text-white" />
//                                         </button>
//                                         <button
//                                             onClick={() => declineFriendRequest(user._id)}
//                                             className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
//                                             title="Decline"
//                                         >
//                                             <X className="size-4 text-gray-300" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FriendRequests;

import { useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";

const FriendRequests = () => {
    const { friendRequests, getFriendRequests, acceptFriendRequest, declineFriendRequest } = useFriendStore();
    const { getUsers } = useChatStore();
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => { getFriendRequests(); }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleAccept = async (userId) => {
        await acceptFriendRequest(userId);
        getUsers();
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-base-300 transition-colors"
            >
                <Bell className="size-5" />
                {friendRequests.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-4 bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center">
                        {friendRequests.length > 9 ? "9+" : friendRequests.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-10 w-80 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-base-300">
                        <h3 className="font-semibold text-sm">Friend Requests</h3>
                        {friendRequests.length > 0 && (
                            <p className="text-xs text-base-content/50 mt-0.5">{friendRequests.length} pending</p>
                        )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {friendRequests.length === 0 ? (
                            <div className="text-center text-base-content/40 py-8 text-sm">
                                No pending requests
                            </div>
                        ) : (
                            friendRequests.map((user) => (
                                <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-base-200 transition-colors">
                                    <img
                                        src={user.profilePic || "/avatar.png"}
                                        alt={user.fullname}
                                        className="size-10 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{user.fullname}</p>
                                        <p className="text-xs text-base-content/40 truncate">{user.email}</p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        <button
                                            onClick={() => handleAccept(user._id)}
                                            className="size-8 rounded-full bg-primary text-primary-content flex items-center justify-center hover:bg-primary/80 transition-colors"
                                            title="Accept"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => declineFriendRequest(user._id)}
                                            className="size-8 rounded-full bg-base-300 hover:bg-base-200 flex items-center justify-center transition-colors"
                                            title="Decline"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendRequests;