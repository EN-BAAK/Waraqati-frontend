"use client";

import React from "react";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between p-6 bg-back">
      <div className="relative w-1/2 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="bg-face w-full h-10 px-10 rounded-lg border border-border shadow-sm text-text-default placeholder:text-text-muted transition focus:outline-none focus:ring-2 focus:ring-main"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      </div>

      <div className="flex items-center gap-6">
        <FiBell className="text-text-default w-6 h-6 cursor-pointer hover:text-main transition" />
        <img
          src="/avatar.png"
          alt="User"
          className="w-10 h-10 rounded-full border border-border"
        />
        <FiLogOut className="text-text-default w-6 h-6 cursor-pointer hover:text-main transition" />
      </div>
    </header>
  );
};

export default Header;
