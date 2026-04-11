import { AccessItem, ROLE, SidebarLink, User } from "@/types/global";
import { FiUsers, FiBriefcase, FiGrid, FiLayers, FiHelpCircle, FiFilePlus, FiFileText, FiFile, FiSettings, FiCheckSquare } from "react-icons/fi";

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

export const GlobalSidebarLinks: SidebarLink[] = [
  { label: "Settings", href: "/settings", Icon: FiSettings },
]

export const ManagerSidebarLinks: SidebarLink[] = [
  { label: "Employees", href: "/dashboard/employees", Icon: FiUsers },
  { label: "Clients", href: "/dashboard/clients", Icon: FiBriefcase },
  { label: "Services", href: "/dashboard/services", Icon: FiGrid },
  { label: "Categories", href: "/dashboard/categories", Icon: FiLayers },
  { label: "Questions", href: "/dashboard/questions", Icon: FiHelpCircle },
  { label: "required Documents", href: "/dashboard/required-documents", Icon: FiFilePlus },
  { label: "Requests", href: "/dashboard/requests", Icon: FiFileText }
];

export const ClientSidebarLinks: SidebarLink[] = [
  { label: "Services", href: "/client/services", Icon: FiLayers },
  { label: "Requests", href: "/client/requests", Icon: FiFileText },
  { label: "Documents", href: "/client/documents", Icon: FiFile },
]

export const EmployeeSidebarLinks: SidebarLink[] = [
  { label: "My tasks", href: "/requests/tasks", Icon: FiCheckSquare },
  { label: "Available Requests", href: "/requests/available-requests", Icon: FiFileText },
]

export const accessGuid: AccessItem[] = [
  { authorized: false, path: "/login", roles: [] },
  { authorized: false, path: "/forgot-password", roles: [] },

  { authorized: true, path: "/settings", roles: [] },

  {
    authorized: true,
    path: "/dashboard",
    roles: [ROLE.ADMIN, ROLE.MANAGER],
    children: [
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
      {
        authorized: true,
        path: "/required-documents",
        roles: [ROLE.MANAGER, ROLE.ADMIN],
        children: [
          { authorized: true, path: "/add", roles: [ROLE.MANAGER] },
          { authorized: true, path: "/edit", roles: [ROLE.MANAGER] },
        ],
      },
      {
        authorized: true,
        path: "/requests",
        roles: [ROLE.MANAGER],
      },
    ]
  },

  {
    authorized: true,
    path: "/client",
    roles: [ROLE.CLIENT]
  },

  {
    authorized: true,
    path: "/requests",
    roles: [ROLE.EMPLOYEE, ROLE.ADMIN, ROLE.MANAGER],
    children: [
      { authorized: true, path: "/available-requests", roles: [] },
      { authorized: true, path: "/tasks", roles: [ROLE.EMPLOYEE, ROLE.ADMIN] }
    ]
  },
];

export const requestStateStyle: Record<string, string> = {
  "in progress": "bg-yellow-100 text-yellow-800",
  "canceled": "bg-red-100 text-red-800",
  "in queue": "bg-blue-100 text-blue-800",
  "in hold": "bg-purple-100 text-purple-800",
  "reviewed": "bg-indigo-100 text-indigo-800",
  "finished": "bg-green-100 text-green-800",
  "succeed": "bg-teal-100 text-teal-800",
};

export const stateAccentLine: Record<string, string> = {
  "in progress": "bg-yellow-400/70",
  "canceled": "bg-red-400/70",
  "in queue": "bg-blue-400/70",
  "in hold": "bg-purple-400/70",
  "reviewed": "bg-indigo-400/70",
  "finished": "bg-green-400/70",
  "succeed": "bg-teal-400/70",
};
