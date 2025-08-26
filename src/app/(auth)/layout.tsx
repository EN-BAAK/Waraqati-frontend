import React from "react"
import { CommonParentProps } from "@/types/global"
import BackgroundImage from "@/assets/background.png"

const AuthLayout: React.FC<CommonParentProps> = ({ children }): React.JSX.Element => {
  return (
    <main
      className="bg-no-repeat bg-center bg-cover min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${BackgroundImage.src})` }}
    >
      <div className="bg-black/30 absolute inset-0 backdrop-blur-sm" />

      <div className="bg-face w-full max-w-[90%] md:max-w-lg lg:max-w-xl p-4 rounded-3xl shadow-xl relative z-[1]">
        <div className="h-full p-4 sm:p-8 md:p-12 border border-border rounded-3xl shadow">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
