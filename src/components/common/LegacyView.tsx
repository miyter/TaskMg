import React, { useEffect, useRef } from 'react';

interface LegacyViewProps {
    render: (container: HTMLElement) => void;
}

export const LegacyView: React.FC<LegacyViewProps> = ({ render }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            render(containerRef.current);
        }
    }, [render]);

    return <div ref={containerRef} className="w-full h-full" />;
};
