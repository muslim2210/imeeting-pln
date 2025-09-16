import * as React from "react"
import Image from "next/image"


const Logo = ({isLogin}: {isLogin?: boolean}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Image
        src="/img/pln-logo.png"
        alt="PLN Logo"
        width={100}
        height={100}
        priority
        className="h-auto w-[30px]"
      />
      <h1 className={`font-bold text-lg ${!isLogin ? "text-white" : "text-black"}`}>iMeeting</h1>
    </div>
     
  )
}

export default Logo
