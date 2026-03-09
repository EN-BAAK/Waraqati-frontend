import { ToastMessage, Warning } from "./components";
import { Update_Offset_Unit_Process, User } from "./global";
import { QueryKey } from "./hooks";

export type AppContextProps = {
  isLoggedIn: boolean;
  pushToast: (toastMessage: ToastMessage) => void;
  showWarning: (warning: Warning) => void;
  user: User
} 

export type OffsetContextProps = {
  updateOffsetUnit: (keys: QueryKey[], process: Update_Offset_Unit_Process) => void,
  getOffsetUnit: (keys: QueryKey[]) => number,
  resetOffsetUnit: (keys: QueryKey[]) => Promise<void>
}