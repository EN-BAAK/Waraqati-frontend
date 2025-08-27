import { ROLE, User } from "@/types/global";

export const initialUser: User = {
  id: -1,
  email: "guest@example.waraqati",
  firstName: "Guest",
  lastName: "Guest",
  identifyNumber: "00000",
  phone: "0000000000",
  role: ROLE.GUEST
}

export const colors = [
  "bg-indigo-600",
  "bg-green-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-teal-600",
  "bg-pink-600",
];