import React, { useState, useRef } from "react";
import TranslationClient from "./TranslationClient.mjs";
import StatusDisplay from "./components/StatusDisplay";
import ButtonGroup from "./components/ButtonGroup";
import Loader from "./components/Loader";

const App = () => {
    const [status, setStatus] = useState("Initializing...");
    const [isPending, setIsPending] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const clientRef = useRef(null);
    const timeout = 60000;

    if (!clientRef.current) {
        clientRef.current = new TranslationClient(
            "http://localhost:8000/status",
            {
                timeout,
                initialInterval: 1000,
                maxInterval: 5000,
                onCompleted: () => {
                    setStatus("Completed");
                    setIsPending(false);
                    setIsComplete(true);
                },
                onError: (error) => {
                    setStatus(`Error: ${error.message}`);
                    setIsPending(false);
                },
                onPending: () => setStatus("Pending..."),
            }
        );
    }

    const handleStart = () => {
        const client = clientRef.current;
        setIsPending(true);
        setIsComplete(false);
        setStatus("Pending...");

        client.pollStatus();

        client.subscribe(
            (status) => {
                setStatus(status);
                if (status === "Cancelled") {
                    setIsPending(false);
                    setIsComplete(false);
                }
            },
            (error) => {
                setStatus(`Error: ${error.message}`);
                setIsPending(false);
            }
        );
    };

    const handleCancel = () => {
        clientRef.current.cancel();
        setIsPending(false);
        setIsComplete(false);
        setStatus("Cancelled");
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 
        p-8 flex items-center justify-center relative overflow-hidden"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full 
            mix-blend-multiply filter blur-xl opacity-70 animate-blob"
                ></div>
                <div
                    className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full 
            mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
                ></div>
                <div
                    className="absolute -bottom-8 left-20 w-96 h-96 bg-green-100 rounded-full 
            mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
                ></div>
            </div>

            <div className="w-full max-w-2xl relative">
                {/* Main Container */}
                <div
                    className="backdrop-blur-lg bg-white/90 p-8 rounded-3xl shadow-2xl 
            border border-gray-100/50 transform transition-all duration-500 
            hover:shadow-3xl hover:bg-white/95"
                >
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 
                to-green-600 text-transparent bg-clip-text transform transition-all duration-300 
                hover:scale-105 cursor-default"
                        >
                            Translation Status
                        </h1>
                        <div className="mt-3 text-gray-600 font-medium relative">
                            <span
                                className="relative inline-block after:content-[''] after:absolute after:w-full 
                  after:h-0.5 after:bg-green-200 after:bottom-0 after:left-0"
                            >
                                Real-time translation status monitoring system
                            </span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="space-y-8">
                        {/* Status Display */}
                        <div
                            className="transform transition-all duration-300 hover:-translate-y-1 
                hover:shadow-lg rounded-xl"
                        >
                            <StatusDisplay status={status} />
                        </div>

                        {/* Loader */}
                        <div
                            className="bg-white/80 rounded-xl p-6 transform transition-all duration-300 
    hover:-translate-y-1 hover:shadow-lg border border-gray-100/50 
    h-[180px] flex items-center justify-center"
                        >
                            <Loader
                                status={status}
                                isPending={isPending}
                                isComplete={isComplete}
                            />
                        </div>

                        {/* Button Group */}
                        <div
                            className="bg-white/80 rounded-xl p-6 transform transition-all duration-300 
                hover:-translate-y-1 hover:shadow-lg border border-gray-100/50"
                        >
                            <ButtonGroup
                                onStart={handleStart}
                                onCancel={handleCancel}
                                isPending={isPending}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            Status updates in real-time
                        </p>
                        <div className="mt-2 flex justify-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
