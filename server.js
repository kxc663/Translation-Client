import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 8000;
const PROCESSING_TIME = 15000;

const processStates = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [id, state] of processStates.entries()) {
        if (now - state.lastAccessed > 60000) {
            processStates.delete(id);
        }
    }
}, 60000);

app.get("/status", (req, res) => {
    const processId = req.query.processId;

    if (!processId) {
        return res.status(400).json({ error: "Process ID is required" });
    }

    if (!processStates.has(processId)) {
        processStates.set(processId, {
            startTime: Date.now(),
            lastAccessed: Date.now(),
        });
    }

    const processState = processStates.get(processId);
    processState.lastAccessed = Date.now();

    const elapsedTime = Date.now() - processState.startTime;
    let result;

    if (elapsedTime < PROCESSING_TIME) {
        result = "pending";
    } else {
        if (Math.random() < 0.1) {
            result = "error";
        } else {
            result = "completed";
        }
        processStates.delete(processId);
    }

    res.json({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
