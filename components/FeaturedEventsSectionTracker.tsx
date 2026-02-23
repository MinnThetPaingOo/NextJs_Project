'use client';

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

const FeaturedEventsSectionTracker = () => {
    const trackerRef = useRef<HTMLDivElement>(null);
    const capturedRef = useRef(false);

    useEffect(() => {
        const element = trackerRef.current;
        if (!element) return;

        // Use IntersectionObserver (browser API) to detect when the section becomes visible
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !capturedRef.current) {
                    capturedRef.current = true;
                    posthog.capture('featured_events_viewed');
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return <div ref={trackerRef} aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none' }} />;
};

export default FeaturedEventsSectionTracker;
