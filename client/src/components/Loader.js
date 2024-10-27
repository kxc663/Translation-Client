import React from "react";
import { Circles } from "react-loader-spinner";
import styled, { keyframes } from "styled-components";

const rotateIn = keyframes`
  from {
    transform: scale(0.8) rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const AnimatedSvg = styled.svg`
    animation: ${rotateIn} 0.3s ease-out;

    .checkmark__circle,
    .error__circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        transform-origin: center;
    }

    .checkmark__check {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    .error__line {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;

        &:nth-child(2) {
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        &:nth-child(3) {
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 1s forwards;
        }
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    min-height: 80px;
`;

const InitMessage = styled.div`
    text-align: center;
    color: #666;
    padding: 1rem;
    animation: fadeIn 0.5s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #4fa94d;
    }

    .message {
        font-size: 1rem;
        font-weight: 500;
    }

    .arrow {
        display: inline-block;
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
`;

const Loader = ({ status, isPending, isComplete }) => {
    const getLoaderState = () => {
        if (isPending) return "pending";
        if (isComplete) return "completed";
        if (status.toLowerCase().includes("error")) return "error";
        if (status.toLowerCase().includes("cancelled")) return "error";
        return null;
    };

    const loaderState = getLoaderState();

    return (
        <Container>
            {!loaderState && status === "Initializing..." && (
                <InitMessage>
                    <div className="icon">🚀</div>
                    <div className="message">
                        Click{" "}
                        <span className="font-bold text-green-600">Start</span>{" "}
                        <span className="arrow">↓</span>
                        <br />
                        to begin the translation process
                    </div>
                </InitMessage>
            )}

            {loaderState === "pending" && (
                <Circles color="#4fa94d" height={80} width={80} />
            )}

            {loaderState === "completed" && (
                <AnimatedSvg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    width="80"
                    height="80"
                >
                    <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="#4fa94d"
                        strokeWidth="2"
                    />
                    <path
                        className="checkmark__check"
                        d="M14 27l10 10L38 16"
                        fill="none"
                        stroke="#4fa94d"
                        strokeWidth="2"
                    />
                </AnimatedSvg>
            )}

            {loaderState === "error" && (
                <AnimatedSvg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    width="80"
                    height="80"
                >
                    <circle
                        className="error__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="#FF5757"
                        strokeWidth="2"
                    />
                    <path
                        className="error__line"
                        d="M16 16L36 36"
                        fill="none"
                        stroke="#FF5757"
                        strokeWidth="2"
                    />
                    <path
                        className="error__line"
                        d="M36 16L16 36"
                        fill="none"
                        stroke="#FF5757"
                        strokeWidth="2"
                    />
                </AnimatedSvg>
            )}
        </Container>
    );
};

export default Loader;
