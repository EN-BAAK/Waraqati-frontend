import { ToastMessage, Warning } from "./components";
import { User } from "./global";

export type AppContextProps = {
  isLoggedIn: boolean;
  pushToast: (toastMessage: ToastMessage) => void;
  showWarning: (warning: Warning) => void;
  user: User
} 