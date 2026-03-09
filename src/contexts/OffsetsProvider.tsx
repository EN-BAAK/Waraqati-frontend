"use client";

import React, { createContext, useContext, useState } from "react";
import { CommonParentProps, OffsetUnit, Update_Offset_Unit_Process } from "@/types/global";
import { QueryKey } from "@/types/hooks";
import { OffsetContextProps } from "@/types/context";
import { wait } from "@/lib/helpers";

const OffsetContext = createContext<OffsetContextProps | undefined>(undefined);

export const OffsetProvider = ({ children }: CommonParentProps): React.JSX.Element => {
  const [offsetUnit, setOffsetUnit] = useState<OffsetUnit>({})

  const setOffsetUnitMap = (keys: QueryKey[], value: QueryKey) => {
    setOffsetUnit((prev: OffsetUnit) => {
      const newState: OffsetUnit = { ...prev };
      let current: OffsetUnit = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        const next = current[key];

        if (typeof next === "object" && next !== null) {
          current[key] = { ...next };
        } else {
          current[key] = {};
        }

        current = current[key] as OffsetUnit;
      }

      current[keys[keys.length - 1]] = Number(value);

      return newState;
    });
  };

  const getOffsetUnitValue = (keys: QueryKey[]): number =>
    (keys.reduce<number | OffsetUnit | undefined>(
      (acc, key) => (typeof acc === "object" && acc !== null ? Number(acc[key]) : undefined),
      offsetUnit
    ) as number) ?? 0;

  const updateOffsetUnit = (keys: QueryKey[], process: Update_Offset_Unit_Process) => {
    const prevValue = getOffsetUnitValue(keys)
    const step = process === Update_Offset_Unit_Process.UP ? 1 : -1
    const value = prevValue + step

    setOffsetUnitMap(keys, value)
  }

  const resetOffsetUnit = async (keys: QueryKey[]) => {
    setOffsetUnitMap(keys, 0)
    await wait(100)
  }

  return (
    <OffsetContext.Provider
      value={{
        updateOffsetUnit,
        getOffsetUnit: getOffsetUnitValue,
        resetOffsetUnit
      }}
    >
      {children}
    </OffsetContext.Provider>
  );
};

export const useOffsetContext = () => {
  const CONTEXT = useContext(OffsetContext);
  return CONTEXT as OffsetContextProps;
};

export default OffsetProvider;
