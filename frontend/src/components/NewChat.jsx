import { X, Search } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const NewChat = ({ onClose, onSelectUser }) => {
  const { users = [] } = useChatStore();
  const { onlineUsers = [] } = useAuthStore();
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const filtered = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    setIsClosing(true); 
    setTimeout(() => onClose(), 250);
  };

  return (
    <div className={`absolute top-0 left-0 h-full w-20 lg:w-72 z-50 bg-base-100 flex flex-col border-r border-base-300 ${isClosing ? "animate-slide-out" : "animate-slide-in"}`}>

      <div className="p-5 bg-base-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold hidden lg:block">New chat</span>
          <button onClick={handleClose} className="text-base-content/50 hover:text-base-content transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="hidden lg:flex relative">
          <Search className="absolute left-3 top-2.5 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 placeholder:text-sm rounded-2xl bg-base-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-2">
        {filtered.map((user) => (
          <button
            key={user._id}
            onClick={() => { onSelectUser(user); handleClose(); }}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors"
          >
            <div className="relative mx-auto lg:mx-0 shrink-0">
              <img
                src={user.profilePic || "https://res.cloudinary.com/dpq0wpobg/image/upload/v1775223227/person_fn8yct.png"}
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-base-content/50">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-base-content/40 py-4 text-sm">No contacts found</div>
        )}
      </div>
    </div>
  );
};

export default NewChat;