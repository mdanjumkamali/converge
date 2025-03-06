import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatWindow from "@/components/chat/chat-window";
import React from "react";
import { getGroups, getUsers, individualChat } from "./action/actions";

async function Page() {
  const users = await getUsers();
  const groups = await getGroups();
  const chats = await individualChat("61d013d1-ee96-4187-bdc2-68cc12992d76");

  return (
    <div className=" text-black flex">
      <ChatSidebar users={users} groups={groups} />
      <ChatWindow chat={chats} />
    </div>
  );
}

export default Page;
