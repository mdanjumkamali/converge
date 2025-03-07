import React, { useEffect, useRef, useState } from "react";
import {
  Chat as chats,
  GroupChat,
} from "@/app/(dashbaord)/(routes)/chat/action/actions";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

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
  created_at: string;
  isOutgoing: boolean;
  status?: "sent" | "delivered" | "read";
  metadata?: {
    email?: string;
  };
}

// Format date for separator
const formatDateForSeparator = (date: Date) => {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMMM d, yyyy");
};

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
    {!message.isOutgoing && (
      <Avatar
        src={message.sender.avatar}
        fallback={message.sender.name.charAt(0)}
      />
    )}
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
  chat: (chats | GroupChat)[];
  currentUserId: string;
}

// Chat Component
const Chat: React.FC<ChatProps> = ({ chat, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const formatMessage = (msg: chats | GroupChat): Message => {
    if ("receiver" in msg) {
      // Individual chat message
      return {
        id: msg.id,
        text: msg.message,
        sender: msg.sender,
        timestamp: new Date(
          new Date(msg.created_at).getTime() + 5.5 * 60 * 60 * 1000
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        created_at: msg.created_at,
        isOutgoing: msg.sender.id === currentUserId,
      };
    } else {
      // Group chat message
      return {
        id: msg.id,
        text: msg.message,
        sender: msg.sender,
        timestamp: new Date(
          new Date(msg.created_at).getTime() + 5.5 * 60 * 60 * 1000
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        created_at: msg.created_at,
        isOutgoing: msg.sender.id === currentUserId,
      };
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.created_at);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const formattedMessages = chat.map((msg) => formatMessage(msg));
  const groupedMessages = groupMessagesByDate(formattedMessages);

  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-12rem)] p-4 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
    >
      {Object.entries(groupedMessages).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <DateSeparator date={formatDateForSeparator(new Date(dateKey))} />
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 p-0 shadow-lg"
        >
          <ArrowDown className="h-5 w-5 text-white" />
        </Button>
      )}
    </div>
  );
};

export default Chat;
