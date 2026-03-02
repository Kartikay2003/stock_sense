import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";

const Header = ({ user }: { user: User }) => {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/Stock_Sense_logo.png" alt="Stock Sense logo" width={140} height={32} className="h-14 w-auto max-w-50 cursor-pointer" />
                    {/* cursor-pointer tailwind class - so its clickable */}
                </Link>
                <nav className="hidden sm:block">
                    {/* sm - small devices */}
                    <NavItems />
                </nav>
                <UserDropdown user={user} />
                {/* creating components for cleaner code & DRY concept */}
            </div>
        </header>
    )
}
export default Header
