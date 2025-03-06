"use client";

import React, { useEffect, useState, useRef } from "react";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import Chat from "./chat-display";
import {
  Chat as chats,
  sendMessageToIndividual,
  individualChat,
  sendMessageToGroup,
  getGroupMessages,
  GroupChat,
  joinGroup,
} from "@/app/(dashbaord)/(routes)/chat/action/actions";
import { createClient } from "@/utils/supabase/client";
import { Users } from "@/interface/users.interface";
import { Group } from "@/interface/group.interface";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

// Avatar Component
const Avatar: React.FC<{ letter: string; color: string }> = ({
  letter,
  color,
}) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
    style={{ backgroundColor: color }}
  >
    {letter}
  </div>
);

// Avatar Group Component
const AvatarGroup: React.FC<{
  users: { initial: string; color: string; status?: "online" | "offline" }[];
}> = ({ users }) => (
  <div className="flex items-center">
    {users.map((user, index) => (
      <div
        key={index}
        className="ring-2 ring-white rounded-full relative"
        style={{ marginLeft: index > 0 ? "-6px" : "0", zIndex: index + 1 }}
      >
        <Avatar letter={user.initial} color={user.color} />
        {user.status && (
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
          />
        )}
      </div>
    ))}
  </div>
);

// Chat Window Component
interface ChatWindowProps {
  initialChat?: chats[];
  chatId?: string | null;
  isGroupChat?: boolean;
  selectedUser?: Users | null;
  selectedGroup?: Group | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  initialChat = [],
  chatId,
  isGroupChat = false,
  selectedUser,
  selectedGroup,
}) => {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );
  const [receiverUserId, setReceiverUserId] = useState<string | undefined>(
    undefined
  );
  const [chat, setChat] = useState<(chats | GroupChat)[]>(initialChat);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("Error fetching user:", error);
        return;
      }
      setCurrentUserId(data.user.id);
    };
    fetchCurrentUser();
  }, []);

  // Handle scroll events
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Set receiver ID when selected user changes
  useEffect(() => {
    if (selectedUser && !isGroupChat) {
      setReceiverUserId(selectedUser.id);
    }
  }, [selectedUser, isGroupChat]);

  // Check if user is in group and join if not
  useEffect(() => {
    const checkAndJoinGroup = async () => {
      if (!isGroupChat || !selectedGroup || !currentUserId || isJoiningGroup)
        return;

      try {
        setIsJoiningGroup(true);
        // Check if user is already a member
        const { data: memberCheck } = await supabase
          .from("group_users")
          .select("*")
          .eq("group_id", selectedGroup.id)
          .eq("user_id", currentUserId)
          .single();

        if (!memberCheck) {
          // User is not a member, join the group
          const result = await joinGroup(selectedGroup.id);
          if (result.success) {
            toast.success("Successfully joined the group!");
          }
        }
      } catch (error) {
        console.error("Error checking/joining group:", error);
        toast.error("Failed to join group. Please try again.");
      } finally {
        setIsJoiningGroup(false);
      }
    };

    checkAndJoinGroup();
  }, [isGroupChat, selectedGroup, currentUserId]);

  // Fetch chat messages
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId || !currentUserId) {
        setChat([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (isGroupChat) {
          const groupMessages = await getGroupMessages(chatId);
          setChat(groupMessages);
        } else {
          const chatMessages = await individualChat(currentUserId);
          const filteredMessages = chatMessages.filter(
            (msg) =>
              (msg.sender.id === currentUserId &&
                msg.receiver.id === selectedUser?.id) ||
              (msg.sender.id === selectedUser?.id &&
                msg.receiver.id === currentUserId)
          );
          setChat(filteredMessages);
        }

        // Scroll to bottom after loading messages
        setTimeout(scrollToBottom, 100);

        if (!receiverUserId && selectedUser) {
          setReceiverUserId(selectedUser.id);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        setChat([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, [chatId, currentUserId, selectedUser, isGroupChat, receiverUserId]);

  // Set up Supabase realtime subscription
  useEffect(() => {
    if (!currentUserId || !chatId) return;

    const channel = supabase.channel("messages_changes");

    if (isGroupChat) {
      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "group_chats",
            filter: `group_id=eq.${chatId}`,
          },
          async () => {
            const groupMessages = await getGroupMessages(chatId);
            setChat(groupMessages);
            setTimeout(scrollToBottom, 100);
          }
        )
        .subscribe();
    } else if (receiverUserId) {
      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chats",
          },
          async (payload) => {
            const messageData = payload.new as {
              sender_id: string;
              receiver_id: string;
            };
            const isRelevantMessage =
              (messageData.sender_id === currentUserId &&
                messageData.receiver_id === receiverUserId) ||
              (messageData.sender_id === receiverUserId &&
                messageData.receiver_id === currentUserId);

            if (isRelevantMessage) {
              const allMessages = await individualChat(currentUserId);
              const filteredMessages = allMessages.filter(
                (msg) =>
                  (msg.sender.id === currentUserId &&
                    msg.receiver.id === receiverUserId) ||
                  (msg.sender.id === receiverUserId &&
                    msg.receiver.id === currentUserId)
              );
              setChat(filteredMessages);
              setTimeout(scrollToBottom, 100);
            }
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, receiverUserId, chatId, isGroupChat]);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!currentUserId || (!selectedUser && !selectedGroup)) {
      console.error("User IDs are not available", {
        currentUserId,
        selectedUser,
        selectedGroup,
      });
      return;
    }

    try {
      if (isGroupChat && selectedGroup) {
        // Create optimistic group message
        const optimisticMessage: GroupChat = {
          id: `temp-${Date.now()}`,
          message: message,
          created_at: new Date().toISOString(),
          sender: {
            id: currentUserId,
            name: "You",
            email: "",
          },
          group_id: selectedGroup.id,
        };

        setChat((prevChat) => [...prevChat, optimisticMessage]);

        await sendMessageToGroup({
          text: message,
          sender_id: currentUserId,
          group_id: selectedGroup.id,
        });

        const groupMessages = await getGroupMessages(selectedGroup.id);
        setChat(groupMessages);
      } else if (selectedUser) {
        // Create optimistic individual message
        const optimisticMessage: chats = {
          id: `temp-${Date.now()}`,
          message: message,
          created_at: new Date().toISOString(),
          sender: {
            id: currentUserId,
            name: "You",
            email: "",
          },
          receiver: {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
          },
        };

        setChat((prevChat) => [...prevChat, optimisticMessage]);

        await sendMessageToIndividual({
          text: message,
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
        });

        const chatMessages = await individualChat(currentUserId);
        const filteredMessages = chatMessages.filter(
          (msg) =>
            (msg.sender.id === currentUserId &&
              msg.receiver.id === selectedUser.id) ||
            (msg.sender.id === selectedUser.id &&
              msg.receiver.id === currentUserId)
        );
        setChat(filteredMessages);
      }

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistic message on error
      setChat((prevChat) =>
        prevChat.filter((msg) => !msg.id.startsWith("temp-"))
      );
    }
  };

  // Generate participant info
  const chatName =
    isGroupChat && selectedGroup
      ? selectedGroup.name
      : selectedUser
        ? selectedUser.name
        : "Chat";
  const chatAvatar = chatName.charAt(0);

  const participants =
    isGroupChat && selectedGroup
      ? selectedGroup.users.map((user) => ({
          initial: user.users.name.charAt(0),
          color: "#4F46E5",
          status: "online" as const,
        }))
      : selectedUser
        ? [
            {
              initial: selectedUser.name.charAt(0),
              color: "#4F46E5",
              status: "online" as const,
            },
          ]
        : [];

  return (
    <div className="w-[70%] h-[calc(100vh-4rem)] flex">
      <div className="w-[95%] flex justify-between flex-col">
        <ChatHeader
          name={chatName}
          avatar={chatAvatar}
          description={
            isGroupChat && selectedGroup ? selectedGroup.description : undefined
          }
          email={!isGroupChat && selectedUser ? selectedUser.email : undefined}
          users={[selectedUser?.name || ""]}
          participants={<AvatarGroup users={participants} />}
        />
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-50 relative"
        >
          {loading || isJoiningGroup ? (
            <div className="h-full flex items-center justify-center">
              {isJoiningGroup ? "Joining group..." : "Loading..."}
            </div>
          ) : (
            <>
              <Chat chat={chat} currentUserId={currentUserId || ""} />
              {showScrollButton && (
                <Button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 p-0 shadow-lg"
                >
                  <ArrowDown className="h-5 w-5 text-white" />
                </Button>
              )}
            </>
          )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <div className="w-[5%] h-[calc(100vh-4rem)] border-l border-gray-100"></div>
    </div>
  );
};

export default ChatWindow;
