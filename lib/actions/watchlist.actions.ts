'use server';

import { revalidatePath } from "next/cache";
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function toggleWatchlistAction(symbol: string, path: string) {
    try {
        console.log(`\n[Watchlist Debug] 1. Button clicked for: ${symbol}`);

        await connectToDatabase();
        console.log(`[Watchlist Debug] 2. Database connected successfully`);

        const session = await getSession();
        if (!session?.user) {
            console.log(`[Watchlist Debug] 3. ERROR: No user session found!`);
            throw new Error("Unauthorized");
        }

        const userId = session.user.id;
        console.log(`[Watchlist Debug] 3. User authenticated! ID: ${userId}`);

        const uppercaseSymbol = symbol.toUpperCase();

        const existing = await Watchlist.findOne({ userId, symbol: uppercaseSymbol });

        if (existing) {
            await Watchlist.deleteOne({ _id: existing._id });
            console.log(`[Watchlist Debug] 4. SUCCESS - Removed ${uppercaseSymbol} from database`);
        } else {
            await Watchlist.create({
                userId: userId,
                symbol: uppercaseSymbol,
                company: uppercaseSymbol
            });
            console.log(`[Watchlist Debug] 4. SUCCESS - Added ${uppercaseSymbol} to database`);
        }

        revalidatePath(path);
        console.log(`[Watchlist Debug] 5. UI revalidated. Done!`);
        return { success: true };
    } catch (error) {
        console.error(">>> WATCHLIST FATAL ERROR <<<", error);
        return { success: false, error: "Failed to update watchlist" };
    }
}

export async function getUserWatchlistSymbols() {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.user) return [];

        const watchlist = await Watchlist.find({ userId: session.user.id }).select('symbol');

        return watchlist.map(item => item.symbol);
    } catch (error) {
        console.error("Error fetching user watchlist:", error);
        return [];
    }
}