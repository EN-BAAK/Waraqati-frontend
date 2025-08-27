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