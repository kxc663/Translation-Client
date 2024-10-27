import axios from "axios";
import { Subject } from "rxjs";

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

        this.resetState();
    }

    resetState() {
        if (this.statusSubject) {
            this.statusSubject.complete();
        }
        this.statusSubject = new Subject();
        this.isPolling = false;
        this.isCancelled = false;
        this.processId = Date.now().toString();
    }

    async pollStatus() {
        console.log(`Polling started`);

        this.resetState();
        this.isPolling = true;

        const startTime = Date.now();
        let interval = this.initialInterval;

        while (Date.now() - startTime < this.timeout && !this.isCancelled) {
            // Check cancelled flag
            try {
                // Return early if cancelled
                if (this.isCancelled) {
                    console.log("Polling cancelled during request");
                    return;
                }

                const response = await axios.get(
                    `${this.serverUrl}?processId=${this.processId}`
                );
                const { result } = response.data;
                console.log(`Polling status: ${result}`);

                if (this.isCancelled) {
                    console.log("Polling cancelled after request");
                    return;
                }

                this.statusSubject.next(result);

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

                // Check cancelled before sleeping
                if (this.isCancelled) {
                    console.log("Polling cancelled before sleep");
                    return;
                }

                interval = Math.min(interval * 2, this.maxInterval);
                const jitter = Math.random() * 0.2 + 0.9;
                const jitteredInterval = interval * jitter;
                await this._sleep(jitteredInterval);
            } catch (error) {
                if (!this.isCancelled) {
                    // Only emit error if not cancelled
                    console.error("Error polling status:", error.message);
                    this.onError(error);
                    this.statusSubject.error(error);
                }
                this.isPolling = false;
                return;
            }
        }

        if (!this.isCancelled) {
            console.log("Polling timed out.");
            const timeoutError = new Error("Polling timed out.");
            this.onError(timeoutError);
            this.statusSubject.error(timeoutError);
        }
        this.isPolling = false;
    }

    cancel() {
        console.log("Cancelling polling...");
        this.isCancelled = true;
        this.isPolling = false;
        this.statusSubject.next("cancelled");
        this.statusSubject.complete();
    }

    _sleep(ms) {
        let timeoutId;
        let intervalId;

        const sleepPromise = new Promise((resolve) => {
            timeoutId = setTimeout(resolve, ms);

            intervalId = setInterval(() => {
                if (this.isCancelled) {
                    clearTimeout(timeoutId);
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);
        }).finally(() => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        });

        return sleepPromise;
    }

    subscribe(onNext, onError, onComplete) {
        return this.statusSubject.subscribe(onNext, onError, onComplete);
    }
}

export default TranslationClient;
