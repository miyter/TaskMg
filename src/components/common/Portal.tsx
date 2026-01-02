import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
    containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
    const [mounted, setMounted] = useState(false);
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        let element = document.getElementById(containerId);

        // Create container if it doesn't exist
        if (!element) {
            element = document.createElement('div');
            element.id = containerId;
            document.body.appendChild(element);
        }

        elementRef.current = element;

        return () => {
            // Optional: Cleanup if we created it. 
            // But usually for a root portal container we might want to keep it.
            // For now, let's just clean up the state.
        };
    }, [containerId]);

    if (!mounted || !elementRef.current) return null;

    return createPortal(children, elementRef.current);
};
