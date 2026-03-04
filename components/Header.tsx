import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Stock Sense logo" width={140} height={32} className="h-14 w-auto max-w-50 cursor-pointer" />
                    {/* cursor-pointer tailwind class - so its clickable */}
                </Link>
                <nav className="hidden sm:block">
                    {/* sm - small devices */}
                    <NavItems initialStocks={initialStocks} />
                </nav>
                <UserDropdown user={user} initialStocks={initialStocks} />
                {/* creating components for cleaner code & DRY concept */}
            </div>
        </header>
    )
}
export default Header
