import Image from "next/image";
import React from "react";
import EmptyImage from "@/assets/empty.png";
import { EmptyElementProps } from "@/types/components";

const EmptyElement: React.FC<EmptyElementProps> = ({ msg = "There is no data yet", action }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
      <Image
        src={EmptyImage}
        alt="Empty"
        width={240}
        height={240}
        className="opacity-80 transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />

      <h2 className="mt-4 pb-2 border-b-2 border-main/40 font-heading capitalize font-semibold text-xl md:text-2xl text-main">
        {msg}
      </h2>

      {action && (
        <div className="mt-4 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyElement;
