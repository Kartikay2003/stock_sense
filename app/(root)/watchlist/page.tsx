import { getUserWatchlistSymbols } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default async function WatchlistPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const symbols = await getUserWatchlistSymbols();

    return (
        <div className="flex min-h-screen p-4 md:p-6 lg:p-8 flex-col max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
                <p className="text-gray-500">Track your favorite stocks and monitor their performance.</p>
            </div>

            {symbols.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed">
                    <p className="text-lg font-medium text-gray-500">Your watchlist is empty</p>
                    <p className="text-sm text-gray-400 mt-1">Press <kbd className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs">Ctrl + K</kbd> to search for a stock and click the star to start tracking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {symbols.map((symbol) => (
                        <Link key={symbol} href={`/stocks/${symbol.toLowerCase()}`}>
                            <div className="flex flex-col p-6 border rounded-xl shadow-sm bg-white dark:bg-black hover:border-blue-500 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{symbol}</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Click to view advanced charts and financials.</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}