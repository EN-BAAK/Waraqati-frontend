"use client";

import UserAvatar from "@/components/UserAvatar";
import { useAppContext } from "@/contexts/AppProvider";
import React from "react";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";

const Header: React.FC = () => {
  const { user } = useAppContext()

  return (
    <header className="bg-back w-full p-2 flex items-center justify-between">
      <div className="relative w-1/2 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="bg-face w-full h-10 px-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-main shadow-sm text-text-default placeholder:text-text-muted transition"
        />
        <FiSearch className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      <div className="flex items-center gap-3">
        <FiBell className="w-6 h-6 text-text-default hover:text-main transition cursor-pointer" />
        <UserAvatar firstName={user.firstName} lastName={user.lastName} id={user.id ?? -1} />
        <FiLogOut className="w-6 h-6 text-text-default hover:text-main transition cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
