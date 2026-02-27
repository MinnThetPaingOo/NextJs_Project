// Central export point for all database models.
// Import models from here instead of individual files to keep imports clean.

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Re-export interfaces for use in type annotations across the app
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
