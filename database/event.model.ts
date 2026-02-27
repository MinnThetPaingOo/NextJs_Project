import mongoose, { Schema, Document, Model } from "mongoose";

// ----- TypeScript Interface -----

export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: "online" | "offline" | "hybrid";
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// ----- Schema Definition -----

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: [true, "Title is required"], trim: true },

        // Auto-generated from title; unique index defined below
        slug: { type: String, unique: true, trim: true },

        description: { type: String, required: [true, "Description is required"], trim: true },
        overview: { type: String, required: [true, "Overview is required"], trim: true },
        image: { type: String, required: [true, "Image is required"], trim: true },
        venue: { type: String, required: [true, "Venue is required"], trim: true },
        location: { type: String, required: [true, "Location is required"], trim: true },

        // Stored as an ISO date string (normalized in pre-save hook)
        date: { type: String, required: [true, "Date is required"] },

        // Stored in HH:MM (24-hour) format (normalized in pre-save hook)
        time: { type: String, required: [true, "Time is required"] },

        mode: {
            type: String,
            enum: { values: ["online", "offline", "hybrid"], message: "Mode must be online, offline, or hybrid" },
            required: [true, "Mode is required"],
        },

        audience: { type: String, required: [true, "Audience is required"], trim: true },
        agenda: { type: [String], required: [true, "Agenda is required"], default: [] },
        organizer: { type: String, required: [true, "Organizer is required"], trim: true },
        tags: { type: [String], required: [true, "Tags are required"], default: [] },
    },
    { timestamps: true }
);

// ----- Helpers -----

/** Converts a title to a URL-friendly slug, e.g. "My Event!" → "my-event" */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")   // remove non-word chars except hyphens
        .replace(/\s+/g, "-")       // replace spaces with hyphens
        .replace(/-+/g, "-");       // collapse consecutive hyphens
}

/** Normalises a date string to ISO "YYYY-MM-DD" format. Throws if invalid. */
function normalizeDate(raw: string): string {
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date value: "${raw}"`);
    }
    return parsed.toISOString().split("T")[0]; // keep only the date portion
}

/** Normalises a time string to "HH:MM" (24-hour) format. Throws if invalid. */
function normalizeTime(raw: string): string {
    // Accept "HH:MM", "HH:MM:SS", or 12-hour "h:MM AM/PM"
    const colonFmt = /^(\d{1,2}):(\d{2})(:\d{2})?$/;
    const ampmFmt = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

    const colonMatch = raw.trim().match(colonFmt);
    if (colonMatch) {
        const hh = colonMatch[1].padStart(2, "0");
        const mm = colonMatch[2];
        return `${hh}:${mm}`;
    }

    const ampmMatch = raw.trim().match(ampmFmt);
    if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = ampmMatch[2];
        const period = ampmMatch[3].toUpperCase();
        if (period === "AM" && hours === 12) hours = 0;
        if (period === "PM" && hours !== 12) hours += 12;
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    throw new Error(`Invalid time value: "${raw}"`);
}

// ----- Pre-save Hook -----

// Use async hook — throw errors instead of next(err) to satisfy TypeScript
EventSchema.pre("save", async function () {
    // Regenerate slug only when title is new or has changed
    if (this.isNew || this.isModified("title")) {
        this.slug = generateSlug(this.title);
    }

    // Normalise date to ISO "YYYY-MM-DD"
    if (this.isNew || this.isModified("date")) {
        this.date = normalizeDate(this.date);
    }

    // Normalise time to "HH:MM"
    if (this.isNew || this.isModified("time")) {
        this.time = normalizeTime(this.time);
    }

    // Ensure required arrays are non-empty
    if (!this.agenda || this.agenda.length === 0) {
        throw new Error("Agenda must contain at least one item");
    }
    if (!this.tags || this.tags.length === 0) {
        throw new Error("Tags must contain at least one item");
    }
});

// ----- Model -----

const Event: Model<IEvent> =
    mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
