import { CommonParentProps } from "@/types/global"
import React from "react"

const AuthLayout: React.FC<CommonParentProps> = ({ children }): React.JSX.Element => {
  return (
    <main className="bg-back min-h-screen flex items-center justify-center">
      <div className="bg-face h-[500px] w-full max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-3xl shadow-xl">
        <div className="h-full p-8 md:p-12 border border-border rounded-3xl shadow">
          {children}
        </div>
      </div>
      {/* <div className="bg-surface h-[700px] px-4">
        <div className="h-[500px] p-8 md:p-12 border border-border rounded-3xl shadow-xl">
          {title && (
            <h1 className="mb-8 font-heading text-center text-3xl md:text-4xl text-main">
              {title}
            </h1>
          )}
          {children}
        </div>
      </div> */}
    </main>
  )
}

export default AuthLayout
