"use client";

import React from "react";
import Link from "next/link";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <FiHome /> },
    { label: "Profile", href: "/dashboard/profile", icon: <FiUser /> },
    { label: "Settings", href: "/dashboard/settings", icon: <FiSettings /> },
  ];

  return (
    <aside className="bg-face w-64 min-h-screen p-6 flex flex-col justify-between border-r border-border shadow-md">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-main w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          W
        </div>
        <h1 className="font-heading font-semibold text-xl text-main">Waraqati</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-main hover:text-white text-text-default font-medium transition"
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 mt-10">
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-border"
        />
        <div className="flex flex-col">
          <span className="font-medium text-text-default">John Doe</span>
          <span className="text-sm text-text-muted">Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
