"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import {signOut} from "@/lib/actions/auth.actions";

// Assuming these types are defined elsewhere in your project
// If you have specific imports for User and StockWithWatchlistStatus, ensure they are at the top
const UserDropdown = ({ user, initialStocks }: {user: any, initialStocks: any[] } ) => {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
            {/* asChild property because its child of actual button */}
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">

                    {/* TRIGGER AVATAR: Only uses Fallback for the initial */}
                    <Avatar className="h-8 w-8 ring-1 ring-yellow-500/50">
                        <AvatarFallback className="bg-yellow-500 text-black text-sm font-bold uppercase">
                            {user?.name ? user.name.charAt(0) : "U"}
                        </AvatarFallback>
                    </Avatar>

                    {/* will show username beside user icon in larger devices */}
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-base font-medium text-gray-400">
                            {user?.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-gray-400 border-gray-800 bg-black">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">

                        {/* INSIDE DROPDOWN AVATAR: Only uses Fallback for the initial */}
                        <Avatar className="h-10 w-10 ring-1 ring-yellow-500/50">
                            <AvatarFallback className="bg-yellow-500 text-black text-lg font-bold uppercase">
                                {user?.name ? user.name.charAt(0) : "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-300">
                                {user?.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-800"/>

                <DropdownMenuItem onClick={handleSignOut} className="text-gray-200 text-md font-medium focus:bg-gray-900 focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>

                <DropdownMenuSeparator className="hidden sm:block bg-gray-800"/>

                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown;