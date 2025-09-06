"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers, FiBriefcase, FiMenu, FiGrid } from "react-icons/fi";
import { useAppContext } from "@/contexts/AppProvider";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";

const links = [
  { label: "Employees", href: "/employees", icon: <FiUsers /> },
  { label: "Clients", href: "/clients", icon: <FiBriefcase /> },
  { label: "Services", href: "/services", icon: <FiGrid /> },
];

const Sidebar: React.FC = () => {
  const { user } = useAppContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={cn(
        "bg-face w-64 min-h-screen p-6 flex border-r border-border shadow-md fixed top-0 left-0 z-40 transform transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full",
        "sm:translate-x-0 sm:static sm:flex"
      )}
    >
      <div className="flex-1 flex flex-col justify-center relative">
        <h1 className="mb-10 flex items-center justify-center gap-3">
          <p className="bg-main w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg text-white">
            W
          </p>
          <span className="font-heading font-semibold text-xl text-main">Waraqati</span>
        </h1>

        <button
          className="bg-main hover:bg-main-hover p-2 sm:hidden rounded shadow-lg text-white absolute top-20 right-[-55] z-41 transition duration-300 cursor-pointer"
          onClick={() => setOpen(prev => !prev)}
        >
          <FiMenu />
        </button>

        <nav className="flex-1 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 flex items-center gap-3 rounded-lg truncate font-medium transition-all duration-300",
                  isActive
                    ? "bg-main text-white"
                    : "text-text-default hover:bg-main hover:text-white"
                )}
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 flex items-center gap-3">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} id={user.id ?? -1} />
          <div className="flex-1 min-w-0 flex flex-col">
            <span
              title={`${user.firstName} ${user.lastName}`}
              className="truncate font-medium text-text-default"
            >
              {`${user.firstName} ${user.lastName}`}
            </span>
            <span className="text-sm text-text-muted truncate">{user.role.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
