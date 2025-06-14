const axios = require("axios");

const QMOI_API_URL = "http://localhost:5001/qmoi"; // Update to your model's endpoint

async function askQmoi(prompt) {
    try {
        const res = await axios.post(QMOI_API_URL, { prompt });
        return res.data.response || "🤖 Qmoi has no answer yet.";
    } catch (err) {
        console.error("QMOI Error:", err.message);
        return "⚠️ Sorry, I'm having trouble processing your request.";
    }
}

module.exports = askQmoi;
