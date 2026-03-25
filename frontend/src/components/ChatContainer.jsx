// // import { useChatStore } from "../store/useChatStore";
// // import { useEffect, useRef } from "react";

// // import ChatHeader from "./ChatHeader";
// // import MessageInput from "./MessageInput";
// // import MessageSkeleton from "./skeletons/MessageSkeleton";
// // import { useAuthStore } from "../store/useAuthStore";
// // import { formatMessageTime } from "../lib/utils";

// // const ChatContainer = () => {
// //   const {
// //     messages,
// //     getMessages,
// //     isMessagesLoading,
// //     selectedUser,
// //     subscribeToMessages,
// //     unsubscribeFromMessages,
// //   } = useChatStore();
// //   const { authUser } = useAuthStore();
// //   const messageEndRef = useRef(null);
// //   const safeMessages = Array.isArray(messages) ? messages : [];


// //   useEffect(() => {
// //     getMessages(selectedUser._id);

// //     subscribeToMessages();

// //     return () => unsubscribeFromMessages();
// //   }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

// //   useEffect(() => {
// //     if (messageEndRef.current && messages) {
// //       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
// //     }
// //   }, [messages]);

// //   if (isMessagesLoading) {
// //     return (
// //       <div className="flex-1 flex flex-col overflow-auto">
// //         <ChatHeader />
// //         <MessageSkeleton />
// //         <MessageInput />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex-1 flex flex-col overflow-auto">
// //       <ChatHeader />

// //       <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //         {safeMessages.map((message) => (
// //           <div 
// //             key={message._id}
// //             className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
// //             ref={messageEndRef}
// //           >
// //             <div className=" chat-image avatar">
// //               <div className="size-10 rounded-full border">
// //                 <img
// //                   src={
// //                     message.senderId === authUser._id
// //                       ? authUser.profilePic || "/avatar.png"
// //                       : selectedUser.profilePic || "/avatar.png"
// //                   }
// //                   alt="profile pic"
// //                 />
// //               </div>
// //             </div>
// //             <div className="chat-header mb-1">
// //               <time className="text-xs opacity-50 ml-1">
// //                 {formatMessageTime(message.createdAt)}
// //               </time>
// //             </div>
// //             <div className="chat-bubble flex flex-col">
// //               {message.image && (
// //                 <img
// //                   src={message.image}
// //                   alt="Attachment"
// //                   className="sm:max-w-50 rounded-md mb-2"
// //                 />
// //               )}
// //               {message.text && <p>{message.text}</p>}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <MessageInput />
// //     </div>
// //   );
// // };
// // export default ChatContainer;

// import { useChatStore } from "../store/useChatStore";
// import { useEffect, useRef } from "react";
// import ChatHeader from "./ChatHeader";
// import MessageInput from "./MessageInput";
// import MessageSkeleton from "./skeletons/MessageSkeleton";
// import MessageStatus from "./Messagestatus";
// import { useAuthStore } from "../store/useAuthStore";
// import { formatMessageTime } from "../lib/utils";

// const ChatContainer = () => {
//   const {
//     messages,
//     getMessages,
//     isMessagesLoading,
//     selectedUser,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   } = useChatStore();
//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);
//   const safeMessages = Array.isArray(messages) ? messages : [];

//   useEffect(() => {
//     getMessages(selectedUser._id);
//     subscribeToMessages();
//     return () => unsubscribeFromMessages();
//   }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

//   useEffect(() => {
//     if (messageEndRef.current && messages) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   if (isMessagesLoading) {
//     return (
//       <div className="flex-1 flex flex-col overflow-auto">
//         <ChatHeader />
//         <MessageSkeleton />
//         <MessageInput />
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col overflow-auto">
//       <ChatHeader />

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {safeMessages.map((message) => {
//           const isMine = message.senderId === authUser._id;

//           return (
//             <div
//               key={message._id}
//               className={`chat ${isMine ? "chat-end" : "chat-start"}`}
//               ref={messageEndRef}
//             >
//               <div className="chat-image avatar">
//                 <div className="size-10 rounded-full border">
//                   <img
//                     src={
//                       isMine
//                         ? authUser.profilePic || "/avatar.png"
//                         : selectedUser.profilePic || "/avatar.png"
//                     }
//                     alt="profile pic"
//                   />
//                 </div>
//               </div>

//               <div className="chat-header mb-1">
//                 <time className="text-xs opacity-50 ml-1">
//                   {formatMessageTime(message.createdAt)}
//                 </time>
//               </div>

//               <div className="chat-bubble">
//                 {/* Image only */}
//                 {message.image && (
//                   <img
//                     src={message.image}
//                     alt="Attachment"
//                     className="sm:max-w-50 rounded-md mb-1"
//                   />
//                 )}

//                 {/* Text + tick inline like WhatsApp */}
//                 {message.text && (
//                   <span className="inline">
//                     {message.text}
//                     {isMine && (
//                       <span className="inline-flex items-end ml-1.5 translate-y-0.5">
//                         <MessageStatus status={message.status} />
//                       </span>
//                     )}
//                   </span>
//                 )}

//                 {/* Image only (no text) — tick bottom right */}
//                 {message.image && !message.text && isMine && (
//                   <div className="flex justify-end mt-1">
//                     <MessageStatus status={message.status} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <MessageInput />
//     </div>
//   );
// };

// export default ChatContainer;

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageStatus from "./Messagestatus";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const TypingIndicator = ({ user }) => (
  <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="size-10 rounded-full border">
        <img src={user.profilePic || "/avatar.png"} alt="typing" />
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
        {safeMessages.map((message) => {
          const isMine = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isMine ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMine
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble">
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
                    {isMine && (
                      <span className="inline-flex items-end ml-1.5 translate-y-[2px]">
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