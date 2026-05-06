import { Schema, model, models } from "mongoose";

const WatchlistSchema = new Schema({
    userId: { type: String, required: true },
    ticker: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
});

WatchlistSchema.index({ userId: 1, ticker: 1 }, { unique: true });

const Watchlist = models.Watchlist || model("Watchlist", WatchlistSchema);

export default Watchlist;