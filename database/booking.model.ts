import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Event from "./event.model";

// ----- TypeScript Interface -----

export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// ----- Email Validation Helper -----

/** RFC-5322-compliant email regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----- Schema Definition -----

const BookingSchema = new Schema<IBooking>(
    {
        // References the Event collection; indexed for faster lookups
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"],
            index: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => EMAIL_REGEX.test(value),
                message: (props: { value: string }) => `"${props.value}" is not a valid email address`,
            },
        },
    },
    { timestamps: true }
);

// ----- Pre-save Hook -----

// Use async hook — throw errors instead of next(err) to satisfy TypeScript
BookingSchema.pre("save", async function () {
    // Verify that the referenced event actually exists before saving a booking
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
        throw new Error(`Event with ID "${this.eventId.toString()}" does not exist`);
    }
});

// ----- Model -----

const Booking: Model<IBooking> =
    mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
