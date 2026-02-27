import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

/**
 * Cached connection interface to store the Mongoose instance
 * and the pending connection promise across hot reloads in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * In development, Next.js hot-reloads the server, which can cause
 * multiple Mongoose connections to be created. We cache the connection
 * on the global object to reuse it across reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

// Store the cache on the global object so it persists across hot reloads
global.mongooseCache = cached;

/**
 * Connects to MongoDB using Mongoose and caches the connection.
 * Subsequent calls return the cached connection instead of creating a new one.
 *
 * @returns A promise that resolves to the Mongoose instance.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists yet, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable Mongoose's internal buffering
    });
  }

  // Await the connection and store it in the cache
  cached.conn = await cached.promise;

  return cached.conn;
}
