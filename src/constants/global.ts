import { ROLE, User } from "@/types/global";

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
