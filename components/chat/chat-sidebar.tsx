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
import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import MessageThreadCard from "./message-thread-card";
import { joinGroup } from "@/app/(dashbaord)/(routes)/chat/action/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

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
  onSelectThread: (id: string, isGroup: boolean) => void;
  selectedThreadId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  users,
  groups,
  onSelectThread,
  selectedThreadId,
}) => {
  const [filterType, setFilterType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  // Get current user and their joined groups
  useEffect(() => {
    const fetchUserAndGroups = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);

        // Fetch user's joined groups
        const { data: userGroups } = await supabase
          .from("group_users")
          .select("group_id")
          .eq("user_id", user.id);

        if (userGroups) {
          setJoinedGroups(new Set(userGroups.map((g) => g.group_id)));
        }
      }
    };

    fetchUserAndGroups();
  }, []);

  // Filter and search messages
  const filteredAndSearchedUsers = users.filter((user) => {
    const matchesFilter = filterType === "group" ? false : true;
    const matchesSearch = searchQuery
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery))
      : true;
    return matchesFilter && matchesSearch;
  });

  const filteredAndSearchedGroups = groups.filter((group) => {
    const matchesFilter = filterType === "person" ? false : true;
    const matchesSearch = searchQuery
      ? group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilter = () => {
    setFilterType("");
  };

  const handleThreadSelect = async (id: string, isGroup: boolean) => {
    if (isGroup && !joinedGroups.has(id)) {
      try {
        const result = await joinGroup(id);
        if (result.success) {
          setJoinedGroups((prev) => new Set(Array.from(prev).concat([id])));
          toast.success("Successfully joined the group!");
        }
      } catch (error) {
        console.error("Error joining group:", error);
        toast.error("Failed to join group. Please try again.");
        return;
      }
    }
    onSelectThread(id, isGroup);
  };

  return (
    <div className="w-[30%] h-[calc(100vh-4rem)] border-r border-gray-100 shadow-sm relative">
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
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-1 border rounded-sm border-gray-100"
          >
            <Input
              className="bg-transparent border-0 focus-visible:ring-offset-0 focus-visible:ring-0 w-20 h-8"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="mr-2 cursor-pointer" size={15} />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`relative bg-white border-gray-100 h-8 hover:text-green-600 flex items-center gap-1 border px-1 rounded-sm cursor-pointer ${filterType ? "text-green-600" : ""}`}
              >
                <Filter size={15} />
                <span className="text-sm">
                  {filterType
                    ? filterType.charAt(0).toUpperCase() + filterType.slice(1)
                    : "All"}
                </span>
                {filterType && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter();
                    }}
                    className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-green-700"
                  >
                    <X size={12} />
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black border-gray-100">
              <DropdownMenuRadioGroup
                value={filterType}
                onValueChange={handleFilterChange}
              >
                <DropdownMenuRadioItem
                  value=""
                  className="hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white"
                >
                  All
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="person"
                  className="hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white"
                >
                  Person
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="group"
                  className="hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white"
                >
                  Group
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Scrollable message list container */}
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {/* User threads */}
        {filteredAndSearchedUsers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium p-2 text-gray-500">
              Direct Messages
            </h3>
            {renderMessageThreadCards(
              filteredAndSearchedUsers,
              handleThreadSelect,
              selectedThreadId,
              false
            )}
          </div>
        )}

        {/* Group threads */}
        {filteredAndSearchedGroups.length > 0 && (
          <div>
            <h3 className="text-sm font-medium p-2 text-gray-500">Groups</h3>
            {renderMessageThreadCards(
              filteredAndSearchedGroups,
              handleThreadSelect,
              selectedThreadId,
              true
            )}
          </div>
        )}

        {/* No results message */}
        {filteredAndSearchedUsers.length === 0 &&
          filteredAndSearchedGroups.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No results found{searchQuery ? ` for "${searchQuery}"` : ""}
            </div>
          )}
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

const renderMessageThreadCards = (
  items: (Users | Group)[],
  onClick: (id: string, isGroup: boolean) => void,
  selectedThreadId: string | null,
  isGroup: boolean
) => {
  return items.map((item, index) => (
    <MessageThreadCard
      key={item.id || index}
      name={item.name}
      lastMessage={"This doesn't go on Tuesday..."}
      phoneNumber={"phone" in item ? item.phone : "+919971844008"}
      additionalPhoneCount={1}
      primaryBadge={{
        text: isGroup ? "Group" : "User",
        color: isGroup ? "green" : "yellow",
      }}
      secondaryBadge={{ text: "Demo", color: "yellow" }}
      unreadCount={4}
      timestamp={item.created_at}
      isActive={selectedThreadId === item.id}
      isGroup={isGroup}
      onClick={() => onClick(item.id, isGroup)}
    />
  ));
};
