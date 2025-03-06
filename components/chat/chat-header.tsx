import { Sparkle } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: React.ReactNode | string;
  description?: string;
  email?: string;
  users?: string[];
  participants?: React.ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  description,
  email,
  users,
  participants,
}) => {
  return (
    <div className="w-full border-b h-16 px-5 flex items-center justify-between border-gray-100 shadow-sm">
      <div className="flex gap-4 items-center">
        <div className="bg-gray-200 rounded-full flex items-center justify-center w-10 h-10">
          {avatar}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{name}</h1>
          <div className="text-sm text-gray-500">
            {description || email || users?.join(", ")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {participants}

        <Sparkle size={15} />
        <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
