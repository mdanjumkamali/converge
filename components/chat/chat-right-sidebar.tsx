import {
  AlignRight,
  LucideLayoutGrid,
  PanelLeftClose,
  PenLine,
  RefreshCcw,
} from "lucide-react";

const RightSidebar = () => {
  const Icons = [
    { icon: <PanelLeftClose size={24} /> },
    { icon: <RefreshCcw size={24} /> },
    { icon: <PenLine size={24} /> },
    { icon: <AlignRight size={24} /> },
    { icon: <LucideLayoutGrid size={24} /> },
  ];
  return (
    <div className="w-[5%] h-[calc(100vh-4rem)] border-l border-gray-100 flex flex-col items-center gap-8 py-16">
      {Icons.map((icon, index) => (
        <div key={index} className="text-gray-400 cursor-pointer">
          {icon.icon}
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
