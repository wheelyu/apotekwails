import { useEffect, useRef } from "react";

export default function useIdleTimer(timeout: number, onIdle: () => void) {
    const lastActive = useRef(Date.now());

    const resetTimer = () => {
        lastActive.current = Date.now();
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];

        events.forEach((e) => {
            window.addEventListener(e, resetTimer);
        });

        const interval = setInterval(() => {
            const diff = Date.now() - lastActive.current;
            if (diff > timeout) {
                onIdle();
            }
        }, 1000);

        return () => {
            events.forEach((e) => {
                window.removeEventListener(e, resetTimer);
            });
            clearInterval(interval);
        };
    }, []);

    return null;
}
