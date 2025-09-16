'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/useAuthStore";
import { FaUserCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";




const UserButton = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle size={30}/>
          <span className="hidden md:block text-base text-white">{user?.name}</span>
          <RiArrowDropDownLine className="text-white mt-[3px]" size={25}/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <div className="flex flex-col gap-2 p-2">
        <span>{user?.email}</span>
        <span>{user?.role}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => useAuthStore.getState().logout()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
