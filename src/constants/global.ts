import { AccessItem, ROLE, SidebarLink, User } from "@/types/global";
import { FiUsers, FiBriefcase, FiGrid, FiLayers, FiHelpCircle } from "react-icons/fi";

export const initialUser: User = {
  id: -1,
  isVerified: true,
  email: "guest@example.waraqati",
  firstName: "Guest",
  lastName: "Guest",
  identityNumber: "00000",
  phone: "0000000000",
  role: ROLE.GUEST
}

export const colors = [
  "bg-indigo-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-teal-600",
  "bg-pink-600",
  "bg-red-600",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-gray-600",
  "bg-cyan-600",
];

export const sidebarLinks: SidebarLink[] = [
  { label: "Employees", href: "/employees", Icon: FiUsers },
  { label: "Clients", href: "/clients", Icon: FiBriefcase },
  { label: "Services", href: "/services", Icon: FiGrid },
  { label: "Categories", href: "/categories", Icon: FiLayers },
  { label: "Questions", href: "/questions", Icon:  FiHelpCircle},
];

export const accessGuid: AccessItem[] = [
  { authorized: false, path: "/login", roles: [] },
  { authorized: false, path: "/forgot-password", roles: [] },

  {
    authorized: true,
    path: "/services",
    roles: [],
    children: [
      { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
      { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
    ],
  },
  {
    authorized: true,
    path: "/categories",
    roles: [ROLE.MANAGER],
    children: [
      { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
      { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
    ],
  },
  {
    authorized: true,
    path: "/clients",
    roles: [ROLE.MANAGER],
    children: [
      { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
      { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
    ],
  },
  {
    authorized: true,
    path: "/employees",
    roles: [ROLE.MANAGER, ROLE.ADMIN],
    children: [
      { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
      { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
    ],
  },
  {
    authorized: true,
    path: "/questions",
    roles: [ROLE.MANAGER, ROLE.ADMIN],
    children: [
      { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
      { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
    ],
  },
];

