"use client";

import { useTransition, useState } from "react";
import { usePathname } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { toggleWatchlistAction } from "@/lib/actions/watchlist.actions";
import { Button } from "@/components/ui/button";

interface Props {
    symbol: string;
    initialIsWatched: boolean;
    variant?: "icon" | "button";
}

export default function WatchlistToggle({ symbol, initialIsWatched, variant = "button" }: Props) {
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isWatched, setIsWatched] = useState(initialIsWatched);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsWatched(!isWatched);

        startTransition(async () => {
            const result = await toggleWatchlistAction(symbol, pathname);

            if (!result.success) {
                setIsWatched(isWatched);
            }
        });
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
                {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                    <Star className={`w-5 h-5 ${isWatched ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                )}
            </button>
        );
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isWatched ? "secondary" : "default"}
            className="flex gap-2"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Star className={`w-4 h-4 ${isWatched ? "fill-current text-yellow-400" : ""}`} />
            )}
            {isWatched ? "Watching" : "Add to Watchlist"}
        </Button>
    );
}