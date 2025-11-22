import { db } from "./src/db";
import { meetings } from "./src/db/schema";

async function clearMeetings() {
    console.log("Clearing all meetings...");
    await db.delete(meetings);
    console.log("All meetings cleared.");
    process.exit(0);
}

clearMeetings().catch((err) => {
    console.error("Error clearing meetings:", err);
    process.exit(1);
});
