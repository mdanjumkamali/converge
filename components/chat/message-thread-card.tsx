import React from "react";
import { Users, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsersChatProps {
  name: string;
  lastMessage: string;
  phoneNumber: string;
  additionalPhoneCount?: number;
  primaryBadge?: {
    text: string;
    color?: "yellow" | "green" | "red";
  };
  secondaryBadge?: {
    text: string;
    color?: "yellow" | "green" | "red";
  };
  unreadCount?: number;
  timestamp: string;
  isActive?: boolean;
  onClick?: () => void;
}

const MessageThreadCard: React.FC<UsersChatProps> = ({
  name,
  lastMessage,
  phoneNumber,
  additionalPhoneCount = 0,
  primaryBadge = { text: "Demo", color: "yellow" },
  secondaryBadge = { text: "Demo", color: "yellow" },
  unreadCount = 0,
  timestamp,
  isActive = false,
  onClick,
}) => {
  // Color mapping for badges
  const badgeColorMap = {
    yellow: "text-orange-400",
    green: "text-green-600",
    red: "text-red-500",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100
        ${isActive ? "bg-gray-100" : ""}`}
      onClick={onClick}
    >
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-white">
          <Users size={15} />
        </div>
        <div>
          <h4>{name}</h4>
          <p className="text-gray-400">{lastMessage}</p>
          <Badge className="text-gray-500 rounded-sm text-gray-400">
            <Phone size={10} className="mr-1" />
            {phoneNumber}{" "}
            {additionalPhoneCount > 0 && `+${additionalPhoneCount}`}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <Badge
            className={`${badgeColorMap[primaryBadge.color || "yellow"]} rounded-sm`}
          >
            {primaryBadge.text}
          </Badge>
          {secondaryBadge && (
            <Badge
              className={`${badgeColorMap[secondaryBadge.color || "yellow"]} rounded-sm`}
            >
              {secondaryBadge.text}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <div className="bg-green-600 rounded-full text-xs text-white w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
          <div className="bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-white">
            <User size={12} />
          </div>
        </div>
        <span className="text-gray-400 text-sm">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageThreadCard;
