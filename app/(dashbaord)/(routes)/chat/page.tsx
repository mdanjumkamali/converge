import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatWindow from "@/components/chat/chat-window";
import React from "react";

const page = () => {
  return (
    <div className=" text-black flex">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
};

export default page;
