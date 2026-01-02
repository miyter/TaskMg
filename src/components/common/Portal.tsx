import { createPortal } from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
    containerId?: string;
}

/**
 * Portal コンポーネント
 * index.html に固定コンテナ (id="portal-root") があることを前提とする。
 * フォールバックとして document.body を使用。
 */
export const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
    const container = document.getElementById(containerId) ?? document.body;
    return createPortal(children, container);
};
