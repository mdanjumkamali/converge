import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Filter,
  Home,
  MessageCircle,
  PanelRightClose,
  Settings,
  Shapes,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";

interface SidebarIconProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({
  icon,
  title,
  isActive = false,
}) => (
  <div
    className={`p-2 rounded-lg cursor-pointer flex justify-center 
      ${isActive ? "bg-gray-100 text-green-600" : "hover:bg-gray-100 hover:text-green-600"}`}
    title={title}
  >
    {icon}
  </div>
);

const LeftSidebar: React.FC = () => {
  const firstGroup = [
    { icon: <Home size={24} />, title: "Home", isActive: false },
  ];

  const secondGroup = [
    { icon: <MessageCircle size={24} />, title: "Chats", isActive: true },
    { icon: <Users size={24} />, title: "Contacts", isActive: false },
    { icon: <Filter size={24} />, title: "Filters", isActive: false },
  ];

  const thirdGroup = [
    { icon: <Zap size={24} />, title: "Automation", isActive: false },
    { icon: <Settings size={24} />, title: "Settings", isActive: false },
  ];

  const bottomIcons = [
    { icon: <Shapes size={24} />, title: "Shapes", isActive: false },
    {
      icon: <PanelRightClose size={24} />,
      title: "Close Panel",
      isActive: false,
    },
  ];

  return (
    <aside className="w-16 h-screen border-r border-gray-100 shadow-sm text-gray-300 flex flex-col">
      <div className="flex flex-col items-center py-4 space-y-2">
        <Avatar className="mb-4">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {firstGroup.map((item, index) => (
          <React.Fragment key={item.title}>
            <SidebarIcon
              icon={item.icon}
              title={item.title}
              isActive={item.isActive}
            />

            <Separator className="w-8 mx-auto mb-2 bg-gray-200" />
          </React.Fragment>
        ))}

        {secondGroup.map((item) => (
          <SidebarIcon
            key={item.title}
            icon={item.icon}
            title={item.title}
            isActive={item.isActive}
          />
        ))}

        <Separator className="w-8 mx-auto mb-2 bg-gray-200" />

        {thirdGroup.map((item) => (
          <SidebarIcon
            key={item.title}
            icon={item.icon}
            title={item.title}
            isActive={item.isActive}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center pb-4 space-y-2">
        {bottomIcons.map((item) => (
          <SidebarIcon
            key={item.title}
            icon={item.icon}
            title={item.title}
            isActive={item.isActive}
          />
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
