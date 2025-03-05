import React, { ReactNode } from "react";
import {
  MessageCircle,
  BadgeHelp,
  RefreshCcwDot,
  Download,
  BellOff,
  TableOfContents,
  Dot,
  ChevronsUpDown,
} from "lucide-react";

interface HeaderIconProps {
  icon?: React.ReactNode;
  title?: string;
  isBorder?: boolean;
  secondIcon?: ReactNode;
}

const HeaderIcon: React.FC<HeaderIconProps> = ({
  icon,
  title,
  isBorder = false,
  secondIcon,
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-2  cursor-pointer text-sm
        ${isBorder ? "border border-gray-200 rounded bg-white shadow-sm text-black" : "border-0 text-gray-500"}
        ${title ? "gap-2" : "gap-0"}`}
    >
      {icon}
      {title && <span>{title}</span>}
      {secondIcon}
    </div>
  );
};

const TopHeader: React.FC = () => {
  const withoutBorder = [
    { icon: <MessageCircle size={20} />, title: "Chats", isBorder: false },
  ];

  const headerItems = [
    { icon: <RefreshCcwDot size={20} />, title: "Refresh", isBorder: true },
    { icon: <BadgeHelp size={20} />, title: "Help", isBorder: true },
    {
      icon: <Dot size={24} className="text-yellow-600" />,
      title: "5/6 phones",
      secondIcon: <ChevronsUpDown size={20} />,
      isBorder: true,
    },
    { icon: <Download size={20} />, title: "", isBorder: true },
    { icon: <BellOff size={20} />, title: "", isBorder: true },
    { secondIcon: <TableOfContents size={20} />, title: "✨", isBorder: true },
  ];

  return (
    <div className="w-full border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-4">
      <div>
        {withoutBorder.map((item, index) => (
          <HeaderIcon
            key={index}
            icon={item.icon}
            title={item.title}
            isBorder={item.isBorder}
          />
        ))}
      </div>

      <div className="flex items-center space-x-5">
        {headerItems.map((item, index) => (
          <HeaderIcon
            key={index}
            icon={item.icon}
            title={item.title || undefined}
            isBorder={item.isBorder}
            secondIcon={item.secondIcon}
          />
        ))}
      </div>
    </div>
  );
};

export default TopHeader;
