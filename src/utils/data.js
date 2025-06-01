import { format, isValid } from "date-fns";


// date formatting utility functions
export const formatDateSafe = (date, dateFormat) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    return isValid(dateObj) ? format(dateObj, dateFormat) : "Invalid Date";
};

export const calculateDuration = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return "N/A";

    const start = new Date(punchIn);
    const end = new Date(punchOut);

    if (!isValid(start) || !isValid(end)) return "Invalid Date";

    const durationMs = end - start;
    const durationSeconds = Math.floor(durationMs / 1000);

    // Calculate hours, minutes, seconds
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    // Format with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, "0");

    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
};
