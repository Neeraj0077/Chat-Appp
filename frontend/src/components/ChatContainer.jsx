import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageStatus from "./Messagestatus";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useState } from 'react';
import { ChevronDown } from "lucide-react";

const TypingIndicator = ({ user }) => (
  <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="size-10 rounded-full">
        <img src={user.profilePic || "https://res.cloudinary.com/dpq0wpobg/image/upload/v1775223227/person_fn8yct.png"} alt="typing" />
      </div>
    </div>
    <div className="chat-bubble bg-base-300 flex items-center gap-1 py-3 px-4">
      <span className="size-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="size-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="size-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];
  const [openMenuId, setOpenMenuId] = useState(null)
  const [isHovered, setIsHovered] = useState(false);

  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
    setOpenMenuId(null);
  };

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]); 

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {safeMessages.map((message, index) => {
          const isMine = message.senderId === authUser._id;
          const prevMessage = safeMessages[index - 1];
          const isConsecutive = prevMessage && prevMessage.senderId === message.senderId;

          return (
            <div
              key={message._id}
              className={`chat ${isMine ? "chat-end" : "chat-start"} ${isConsecutive ? "-mt-7" : ""} group`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full ">
                  {!isConsecutive && (
                    <img
                      src={
                        isMine
                          ? authUser.profilePic || "https://res.cloudinary.com/dpq0wpobg/image/upload/v1775223227/person_fn8yct.png"
                          : selectedUser.profilePic || "https://res.cloudinary.com/dpq0wpobg/image/upload/v1775223227/person_fn8yct.png"
                      }
                      alt="profile pic"
                    />)}
                </div>
              </div> 

              <div className={`chat-bubble py-1 relative ${isConsecutive ? "before:hidden" : ""  // hide tail
                } ${isMine ? "rounded-tl-lg rounded-tr-lg rounded-bl-lg" : "rounded-tl-lg rounded-tr-lg rounded-br-lg"}`}>

                <button onClick={() => setOpenMenuId(message._id)} className={`absolute top-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-600 ${isMine ? "-left-5" : "-right-5"}`} >
                  <ChevronDown size={14} />
                </button> 
                
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-50 rounded-md mb-1"
                  />
                )}

                {message.text && (
                  <span className="inline">
                    {message.text}
                    <time className="text-[10px] opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                    {isMine && (
                      <span className="inline-flex items-end ml-1.5 translate-y-0.5">
                        <MessageStatus status={message.status} />
                      </span>
                    )}
                  </span>
                )}

                {message.image && !message.text && isMine && (
                  <div className="flex justify-end mt-1">
                    <MessageStatus status={message.status} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator user={selectedUser} />}

        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;