"use client";

import {
  ChevronsUpDown,
  Clock,
  ClockAlert,
  FileText,
  Mic,
  Paperclip,
  SendHorizonal,
  Smile,
  Sparkle,
} from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SearchInput: React.FC<{ onSubmit: (text: string) => void }> = ({
  onSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      onSubmit(searchQuery);
      setSearchQuery(""); // Clear input after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <Input
        className="bg-transparent border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        placeholder="Message..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">
        <SendHorizonal className="cursor-pointer text-green-600" size={20} />
      </button>
    </form>
  );
};

const Icons = [
  { icon: <Paperclip size={20} /> },
  { icon: <Smile size={20} /> },
  { icon: <Clock size={20} /> },
  { icon: <ClockAlert size={20} /> },
  { icon: <Sparkle size={20} /> },
  { icon: <FileText size={20} /> },
  { icon: <Mic size={20} /> },
];

const ChatInput: React.FC<{ onSendMessage: (text: string) => void }> = ({
  onSendMessage,
}) => {
  return (
    <div className="border-t border-gray-100 w-full h-24 px-4">
      <div>
        <SearchInput onSubmit={onSendMessage} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-5 ">
          {Icons.map((icon, index) => (
            <div key={index} className="cursor-pointer">
              {icon.icon}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border p-1 border-gray-100 shadow-sm rounded-sm w-36 cursor-pointer">
          <div className="flex items-center gap-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Periskope
          </div>
          <ChevronsUpDown size={15} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
