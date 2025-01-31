import axios from "axios";

async function logErrorToServer(message) {
    try {
        await axios.post("https://playlist-api-mu.vercel.app/error", { msg: message });
        console.log("Error logged successfully.");
    } catch (error) {
        console.error("Failed to log error:", error);
    }
}

export default logErrorToServer;