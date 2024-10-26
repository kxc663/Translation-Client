import express from "express";

const app = express();
const PORT = 8000;

const PROCESSING_TIME = 15000;
const START_TIME = Date.now();

app.get("/status", (req, res) => {
    const elapsedTime = Date.now() - START_TIME;
    let result;

    if (elapsedTime < PROCESSING_TIME) {
        result = "pending";
    } else if (Math.random() < 0.1) {
        result = "error";
    } else {
        result = "completed";
    }

    res.json({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
