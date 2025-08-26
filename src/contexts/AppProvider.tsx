"use client";

import React, { createContext, useContext, useState } from "react";
import { ToastMessage, Warning as WarningProps } from "@/types/components";
import { CommonParentProps } from "@/types/global";
import { AppContextProps } from "@/types/context";
import { useValidateAuthentication } from "@/hooks/useAuth";
import Toast from "@/components/Toast";
import Warning from "@/components/Warning";

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: CommonParentProps): React.JSX.Element => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [warning, setWarning] = useState<WarningProps | undefined>(undefined);

  const { isError, data } = useValidateAuthentication();

  const pushToast = (toastMessage: ToastMessage) => {
    setToasts((prev) => [...prev, toastMessage]);
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError,
        pushToast,
        showWarning: (warningProps) => setWarning(warningProps),
        user: data,
      }}
    >
      <div className="fixed left-0 z-50">
        {toasts.map((toast, i) => (
          <Toast
            key={i}
            index={i}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(i)}
          />
        ))}
      </div>

      {warning && (
        <Warning
          message={warning.message}
          btn1={warning.btn1}
          btn2={warning.btn2}
          styleBtn1={warning.styleBtn1}
          styleBtn2={warning.styleBtn2}
          onClose={() => setWarning(undefined)}
          handleBtn2={warning.handleBtn2}
        />
      )}

      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const CONTEXT = useContext(AppContext);
  return CONTEXT as AppContextProps;
};

export default AppProvider;
