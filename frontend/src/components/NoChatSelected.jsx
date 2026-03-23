import { useState } from "react";
import { MessageSquare, UserRoundPlus } from "lucide-react";
import AddFriends from "./AddFriends";

const NoChatSelected = () => {
  const [showAddFriends, setShowAddFriends] = useState(false);

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting, or add new friends to get started.
        </p>

        <button
          onClick={() => setShowAddFriends(true)}
          className="btn btn-primary gap-2"
        >
          <UserRoundPlus className="size-5" />
          Add Friends
        </button>
      </div>

      {showAddFriends && (
        <AddFriends onClose={() => setShowAddFriends(false)} />
      )}
    </div>
  );
};

export default NoChatSelected;