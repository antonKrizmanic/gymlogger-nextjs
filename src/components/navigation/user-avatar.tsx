'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function UserAvatar() {
    const { data: session } = useSession();
    const { user } = session || {};

    const getInitials = (name: string) => {
        if (!name) return 'JD';
        const nameParts = name.split(' ');
        const initials = nameParts.map((part) => part[0]).join('');
        return initials;
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out rounded-lg">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="text-white bg-slate-500">
                        {getInitials(user?.name || '')}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link
                            href="/user/profile"
                            className="flex items-center gap-2 w-full"
                        >
                            Profile
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
