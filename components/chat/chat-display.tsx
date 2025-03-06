"use client";

import React from "react";
import { Chat as chats } from "@/app/(dashbaord)/(routes)/chat/action/actions";
import { createClient } from "@/utils/supabase/client";
// Message Types
interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    phoneNumber?: string;
    avatar?: string;
  };
  timestamp: string;
  isOutgoing: boolean;
  status?: "sent" | "delivered" | "read";
  metadata?: {
    email?: string;
  };
}

// DateSeparator Component
const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="flex justify-center my-4">
    <div className="bg-gray-100 text-gray-500 text-sm px-4 py-1 rounded-lg">
      {date}
    </div>
  </div>
);

// ChatMessage Component
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div
    className={`flex mb-2 ${message.isOutgoing ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`relative max-w-[80%] p-2 rounded-lg ${
        message.isOutgoing
          ? "bg-green-100 rounded-tr-none"
          : "bg-white rounded-tl-none"
      }`}
    >
      {!message.isOutgoing && (
        <div className="text-sm font-medium text-green-500">
          {message.sender.name}
          {message.sender.phoneNumber && (
            <span className="ml-2 text-gray-400 text-xs">
              {message.sender.phoneNumber}
            </span>
          )}
        </div>
      )}
      <div className="text-sm">{message.text}</div>
      <div className="flex items-center justify-end mt-1 gap-1">
        {message.metadata?.email && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            📧 {message.metadata.email}
          </div>
        )}
        <div className="text-xs text-gray-400">{message.timestamp}</div>
      </div>
    </div>
  </div>
);

// Avatar Component
const Avatar: React.FC<{ src?: string; fallback: string }> = ({
  src,
  fallback,
}) => (
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt="avatar" className="w-full h-full object-cover" />
    ) : (
      <span className="text-sm">{fallback}</span>
    )}
  </div>
);

interface ChatProps {
  chat: chats[];
}
// Chat Component
const Chat: React.FC<ChatProps> = ({ chat }) => {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id);
    };
    fetchCurrentUser();
  }, [supabase]);

  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <DateSeparator date="22-01-2025" />
        {chat.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              text: message.message,
              sender: message.sender,
              timestamp: new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOutgoing: message.sender.id === currentUserId,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Chat;
