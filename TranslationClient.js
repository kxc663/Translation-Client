import axios from "axios";
import { Subject } from "rxjs";

/**
 * Creates a new client instance for handling translation requests
 * @param {string} serverUrl - The URL of the translation server
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Maximum time (ms) to wait for translation (default: 30000)
 * @param {number} options.initialInterval - Initial polling interval in ms (default: 1000)
 * @param {number} options.maxInterval - Maximum polling interval in ms (default: 5000)
 * @param {Function} options.onCompleted - Callback when translation completes
 * @param {Function} options.onError - Callback when error occurs
 * @param {Function} options.onPending - Callback while translation is pending
 */

class TranslationClient {
    constructor(serverUrl, options = {}) {
        this.serverUrl = serverUrl;
        this.timeout = options.timeout || 30000;
        this.initialInterval = options.initialInterval || 1000;
        this.maxInterval = options.maxInterval || 5000;
        this.onCompleted =
            options.onCompleted ||
            (() => console.log("Translation completed."));
        this.onError =
            options.onError ||
            ((error) => console.log("An error occurred:", error.message));
        this.onPending =
            options.onPending ||
            (() => console.log("Translation is still pending..."));

        this.statusSubject = new Subject();
        this.isPolling = false;
    }

    async pollStatus() {
        // Prevent multiple polling requests
        if (this.isPolling) {
            console.warn("Polling is already in progress.");
            return;
        }
        this.isPolling = true;

        const startTime = Date.now();
        let interval = this.initialInterval;

        // Poll the server until the translation is completed
        while (Date.now() - startTime < this.timeout) {
            try {
                const response = await axios.get(this.serverUrl);
                const { result } = response.data;

                this.statusSubject.next(result);

                // Handle the different status results
                if (result === "completed") {
                    this.onCompleted();
                    this.statusSubject.complete();
                    this.isPolling = false;
                    return;
                } else if (result === "error") {
                    const error = new Error(
                        "An error occurred during translation."
                    );
                    this.onError(error);
                    this.statusSubject.error(error);
                    this.isPolling = false;
                    return;
                } else if (result === "pending") {
                    this.onPending();
                } else {
                    console.warn(`Unknown status received: ${result}`);
                }

                // Exponential backoff with jitter
                interval = Math.min(interval * 2, this.maxInterval);
                const jitter = Math.random() * 0.2 + 0.9;
                const jitteredInterval = interval * jitter;
                await this._sleep(jitteredInterval);
            } catch (error) {
                console.error("Error polling status:", error.message);
                this.onError(error);
                this.statusSubject.error(error);
                this.isPolling = false;
                return;
            }
        }

        console.log("Polling timed out.");
        const timeoutError = new Error("Polling timed out.");
        this.onError(timeoutError);
        this.statusSubject.error(timeoutError);
        this.isPolling = false;
    }

    // Cancel the polling process
    cancel() {
        this.statusSubject.complete();
        this.isPolling = false;
    }

    // Helper function to sleep for a given number of milliseconds
    _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Subscribe to status updates from the client
    subscribe(onNext, onError, onComplete) {
        return this.statusSubject.subscribe(onNext, onError, onComplete);
    }
}

export default TranslationClient;
