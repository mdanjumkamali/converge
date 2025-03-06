"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "./chat-sidebar";
import ChatWindow from "./chat-window";
import { Group } from "@/interface/group.interface";
import { Users } from "@/interface/users.interface";

interface ChatContainerProps {
  initialUsers: Users[];
  initialGroups: Group[];
}

export default function ChatContainer({
  initialUsers,
  initialGroups,
}: ChatContainerProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Select first user by default
  useEffect(() => {
    if (initialUsers.length > 0 && !selectedThreadId) {
      const firstUser = initialUsers[0];
      setSelectedThreadId(firstUser.id);
      setSelectedUser(firstUser);
      setIsGroupChat(false);
    }
  }, [initialUsers, selectedThreadId]);

  const handleThreadSelect = (id: string, isGroup: boolean) => {
    setSelectedThreadId(id);
    setIsGroupChat(isGroup);

    if (isGroup) {
      const group = initialGroups.find((g) => g.id === id);
      setSelectedGroup(group || null);
      setSelectedUser(null);
    } else {
      const user = initialUsers.find((u) => u.id === id);
      setSelectedUser(user || null);
      setSelectedGroup(null);
    }
  };

  return (
    <div className="text-black flex">
      <ChatSidebar
        users={initialUsers}
        groups={initialGroups}
        selectedThreadId={selectedThreadId}
        onSelectThread={handleThreadSelect}
      />
      <ChatWindow
        chatId={selectedThreadId}
        isGroupChat={isGroupChat}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
      />
    </div>
  );
}
