import React from "react";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";

const Avatar: React.FC<{ letter: string; color: string }> = ({
  letter,
  color,
}) => {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
      style={{ backgroundColor: color }}
    >
      {letter}
    </div>
  );
};

const AvatarGroup: React.FC<{
  users: { initial: string; color: string; status?: "online" | "offline" }[];
  maxDisplay?: number;
}> = ({ users, maxDisplay = 3 }) => {
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <div className="flex items-center">
      <div className="flex">
        {displayUsers.map((user, index) => (
          <div
            key={index}
            className="ring-2 ring-white rounded-full relative"
            style={{
              marginLeft: index > 0 ? "-6px" : "0",
              zIndex: index + 1,
            }}
          >
            <Avatar letter={user.initial} color={user.color} />
            {user.status && (
              <div
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  user.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {remainingCount > 0 && (
        <div className="ml-1 bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600 font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

const ChatWindow = () => {
  const chatName = "Test El Centro";
  const chatAvatar = "TC";
  const chatUsers = [
    "Roshnaq Airtel",
    "Roshnaq Jio",
    "Bharat Kumar Ramesh",
    "Periskope",
  ];

  const participants: {
    initial: string;
    color: string;
    status?: "online" | "offline";
  }[] = [
    { initial: "R", color: "#4F46E5", status: "online" },
    { initial: "H", color: "#0EA5E9", status: "offline" },
    { initial: "B", color: "#EF4444", status: "online" },
    { initial: "P", color: "#10B981", status: "offline" },
    { initial: "S", color: "#F59E0B", status: "online" },
    { initial: "K", color: "#8B5CF6", status: "offline" },
  ];
  return (
    <div className="w-[70%] h-[calc(100vh-4rem)] flex">
      <div className="w-[95%] flex justify-between flex-col">
        <ChatHeader
          name={chatName}
          avatar={chatAvatar}
          users={chatUsers}
          participants={<AvatarGroup users={participants} maxDisplay={5} />}
        />

        <ChatInput />
      </div>
      <div className="w-[5%] h-[calc(100vh-4rem)] border-l border-gray-100"></div>
    </div>
  );
};

export default ChatWindow;
