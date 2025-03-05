"use client";

import React, { useState } from "react";
import { Filter, FolderDown, Search, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const ChatSidebar: React.FC = () => (
  <div className="w-[30%] h-[calc(100vh-4rem)] border-r border-gray-100 shadow-sm">
    <Header />
  </div>
);

export default ChatSidebar;
