"use client"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function UserAvatar() {
    const { data: session  } = useSession()
    const { user } = session || {};
   
    const getInitials = (name: string) => {
        if (!name) return "JD"
        const nameParts = name.split(" ")
        const initials = nameParts.map((part) => part[0]).join("")
        return initials
    }

    return (
        <Avatar>
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="text-white bg-slate-500">{getInitials(user?.name || '')}</AvatarFallback>
        </Avatar>
    )
}