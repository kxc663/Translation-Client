/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            animation: {
                blob: "blob 7s infinite",
                "fade-in": "fade-in 0.5s ease-out",
                "check-rotate": "check-rotate 0.3s ease-out",
                "error-rotate": "error-rotate 0.3s ease-out",
                "check-circle":
                    "draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards",
                "check-path":
                    "draw-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards",
                "error-circle":
                    "draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards",
                "error-path":
                    "draw-error 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                "fade-in": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                "check-rotate": {
                    from: {
                        transform: "scale(0.8) rotate(-45deg)",
                        opacity: "0",
                    },
                    to: {
                        transform: "scale(1) rotate(0deg)",
                        opacity: "1",
                    },
                },
                "error-rotate": {
                    from: {
                        transform: "scale(0.8) rotate(45deg)",
                        opacity: "0",
                    },
                    to: {
                        transform: "scale(1) rotate(0deg)",
                        opacity: "1",
                    },
                },
                "draw-circle": {
                    "0%": {
                        strokeDashoffset: "166",
                    },
                    "100%": {
                        strokeDashoffset: "0",
                    },
                },
                "draw-check": {
                    "0%": {
                        strokeDashoffset: "48",
                    },
                    "100%": {
                        strokeDashoffset: "0",
                    },
                },
                "draw-error": {
                    "0%": {
                        strokeDashoffset: "48",
                    },
                    "100%": {
                        strokeDashoffset: "0",
                    },
                },
            },
        },
    },
    variants: {
        extend: {
            scale: ["hover", "group-hover"],
            transform: ["hover", "group-hover"],
        },
    },
    plugins: [],
};
