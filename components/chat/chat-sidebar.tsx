"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Group } from "@/interface/group.interface";
import { Users } from "@/interface/users.interface";
import { Filter, FolderDown, MessageCircle, Search, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import MessageThreadCard from "./message-thread-card";

interface FilterOption {
  value: string;
  label: string;
}

const FilterByType: React.FC = () => {
  const [filterType, setFilterType] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  const filterOptions: FilterOption[] = [
    { value: "group", label: "Group" },
    { value: "person", label: "Person" },
  ];

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setIsFiltered(true);
    console.log(value);
  };

  const clearFilter = () => {
    setFilterType("");
    setIsFiltered(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`relative bg-white border-gray-100 h-8 hover:text-green-600 flex items-center gap-1 border px-1 rounded-sm cursor-pointer ${isFiltered ? "text-green-600" : ""}`}
        >
          <Filter size={15} />
          <span className="text-sm">Filtered</span>
          {isFiltered && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                clearFilter();
              }}
              className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            >
              <X size={12} />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-black border-gray-100 relative">
        <DropdownMenuRadioGroup
          value={filterType}
          onValueChange={handleFilterChange}
        >
          {filterOptions.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="hover:bg-green-600 focus:bg-green-600"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    // Add your search logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1 border rounded-sm border-gray-100"
    >
      <Input
        className="bg-transparent border-0 focus-visible:ring-offset-0 focus-visible:ring-0 w-20 h-8"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">
        <Search className="mr-2 cursor-pointer" size={15} />
      </button>
    </form>
  );
};

const Header: React.FC = () => (
  <div className="w-full border-b p-4 border-gray-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-green-600 flex items-center gap-2">
        <FolderDown size={20} />
        <span className="text-sm">Custom filter</span>
      </div>
      <Badge
        variant="outline"
        className="text-black rounded-sm border-gray-100 font-normal h-8"
      >
        Save
      </Badge>
    </div>
    <div className="flex items-center gap-2">
      <SearchInput />
      <FilterByType />
    </div>
  </div>
);

interface ChatSidebarProps {
  users: Users[];
  groups: Group[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ users, groups }) => {
  return (
    <div className="w-[30%] h-[calc(100vh-4rem)] border-r border-gray-100 shadow-sm relative">
      <Header />

      {/* Scrollable message list container */}
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {users && renderMessageThreadCards(users)}
        {groups && renderMessageThreadCards(groups)}
      </div>

      <div className="absolute bottom-4 right-4">
        <Button
          className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700 shadow-lg"
          onClick={() => console.log("New message")}
        >
          <div className="flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

const renderMessageThreadCards = (items: any[]) => {
  return items.map((item, index) => (
    <MessageThreadCard
      key={index}
      name={item.name}
      lastMessage={"This doesn't go on Tuesday..."}
      phoneNumber={item.phone || "+919971844008"}
      additionalPhoneCount={1}
      primaryBadge={{ text: "Demo", color: "yellow" }}
      secondaryBadge={{ text: "Demo", color: "yellow" }}
      unreadCount={4}
      timestamp={item.created_at}
      onClick={() => console.log(`Clicked ${item.id}`)}
    />
  ));
};
