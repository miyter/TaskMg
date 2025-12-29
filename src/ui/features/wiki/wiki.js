import { WIKI_DATA } from './wiki-data.js';
import { WikiRenderer } from './components/wiki-renderer.js';

export function renderWiki(container) {
    if (!container) return;

    // Apply Callback: Fire a custom event that the application can listen to
    const handleApply = (modeId) => {
        console.log(`Applying framework mode: ${modeId}`);

        // Custom event for navigation
        const event = new CustomEvent('navigate-to-wizard', {
            detail: { mode: modeId },
            bubbles: true,
            composed: true
        });
        container.dispatchEvent(event);

        // Fallback/Direct interaction (Assuming global access or simple implementation for now)
        // In a real app, strict event handling at the root level is preferred.
        // For this demo, let's show visual feedback.
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-fade-in-up';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-green-400 text-xl">✓</span>
                <div>
                    <h4 class="font-bold">Wikiから反映しました</h4>
                    <p class="text-xs text-gray-400">ウィザードで「${modeId.toUpperCase()}」モードを開始します...</p>
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            // Here we would ideally trigger the view change.
            // Dispatching to global window for easier catching in main loop if needed
            window.dispatchEvent(new CustomEvent('change-view', { detail: { view: 'wizard', mode: modeId } }));
        }, 1500);
    };

    const renderer = new WikiRenderer(WIKI_DATA, handleApply);
    renderer.render(container);
}
