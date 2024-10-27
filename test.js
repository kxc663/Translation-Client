import { spawn } from "child_process";
import TranslationClient from "./client/src/TranslationClient.mjs";

// Start the server
const serverProcess = spawn("node", ["server.js"], { stdio: "inherit" });

serverProcess.on("error", (error) => {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
});

// Wait for the server to start
setTimeout(() => {
    // Create a new TranslationClient instance
    const client = new TranslationClient("http://localhost:8000/status", {
        timeout: 20000,
        initialInterval: 1000,
        maxInterval: 5000,
        onCompleted: () => {
            console.log("Test: Translation has completed!");
            serverProcess.kill();
        },
        onError: (error) => {
            console.log(`Test: Translation encountered an error: ${error.message}`);
            serverProcess.kill();
        },
        onPending: () => console.log("Test: Translation is still pending..."),
    });

    client.pollStatus();

    const subscription = client.subscribe(
        (status) => {
            console.log(`Status update from observable: ${status}`);
        },
        (error) => {
            console.error(`Error from observable: ${error.message}`);
            serverProcess.kill();
        },
        () => {
            console.log("Observable status updates completed.");
            serverProcess.kill();
        }
    );
}, 1000);
