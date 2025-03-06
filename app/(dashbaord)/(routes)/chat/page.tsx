import React from "react";
import { getGroups, getUsers } from "./action/actions";
import ChatContainer from "@/components/chat/chat-container";

async function Page() {
  const users = await getUsers();
  const groups = await getGroups();

  return <ChatContainer initialUsers={users} initialGroups={groups} />;
}

export default Page;
