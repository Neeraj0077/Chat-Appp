import { useEffect, useState } from "react";
import { X, Search, UserPlus, UserCheck, UserX, Clock } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";

const AddFriends = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const { searchResults, isSearching, searchUsers, sendFriendRequest, cancelFriendRequest } = useFriendStore();
    const { onlineUsers = [] } = useAuthStore();

    useEffect(() => {
        const timeout = setTimeout(() => {
            searchUsers(query);
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const getActionButton = (user) => {
        switch (user.status) {
            case "friend":
                return (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-medium px-3 py-1.5 rounded-full bg-green-400/10">
                        <UserCheck className="size-3.5" /> Friends
                    </span>
                );
            case "sent":
                return (
                    <button
                        onClick={() => cancelFriendRequest(user._id)}
                        className="flex items-center gap-1 text-xs text-yellow-400 font-medium px-3 py-1.5 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
                    >
                        <Clock className="size-3.5" /> Sent
                    </button>
                );
            case "received":
                return (
                    <span className="flex items-center gap-1 text-xs text-blue-400 font-medium px-3 py-1.5 rounded-full bg-blue-400/10">
                        <UserX className="size-3.5 cursor-pointer" /> Check Requests
                    </span>
                );
            default:
                return (
                    <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="flex items-center gap-1 text-xs text-white font-medium px-3 py-1.5 rounded-full bg-[#5754E8] hover:bg-[#4a47d4] transition-colors cursor-pointer"
                    >
                        <UserPlus className="size-3.5 cursor-pointer" /> Add
                    </button>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1d27] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Add Friends</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search people by name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#2a2d3e] border border-transparent hover:border-[#5754E8]/30 focus:outline-none focus:ring-2 focus:ring-[#5754E8] text-sm text-gray-200 placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 px-2 pb-4">
                    {isSearching ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner text-primary" />
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center text-zinc-500 py-8 text-sm">
                            {query ? "No users found" : "Start typing to search for people"}
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a2d3e] transition-colors"
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={user.profilePic || "/avatar.png"}
                                        alt={user.fullname}
                                        className="size-11 rounded-full object-cover"
                                    />
                                    {onlineUsers.includes(user._id) && (
                                        <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-200 truncate">{user.fullname}</p>
                                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                </div>
                                {getActionButton(user)}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddFriends;