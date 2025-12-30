/**
 * カラーピッカーのロジックとUI制御
 */

// カラー設定
const PRESET_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']; // Blue, Red, Green, Orange, Purple
const STORAGE_KEY_CUSTOM_COLORS = 'timeblock_custom_colors';

let activeColorTrigger: HTMLElement | null = null;
let activeCustomIndex = -1;

function getCustomColors(): string[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_COLORS);
        // Default white/gray slots
        return stored ? JSON.parse(stored) : ['#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB'];
    } catch {
        return ['#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB'];
    }
}

function saveCustomColors(colors: string[]) {
    localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(colors));
}

export function initColorPicker(modal: HTMLElement) {
    const picker = document.getElementById('tb-color-picker');
    const presetsContainer = document.getElementById('tb-color-presets');
    const customsContainer = document.getElementById('tb-color-customs');
    const customInput = document.getElementById('tb-custom-color-input') as HTMLInputElement | null;
    const editBtn = document.getElementById('tb-custom-color-edit-btn');

    if (!picker || !presetsContainer || !customsContainer || !customInput || !editBtn) return;

    // Render Presets
    presetsContainer.innerHTML = PRESET_COLORS.map(color => `
        <button class="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400"
            style="background-color: ${color}" data-color="${color}"></button>
    `).join('');

    // Render Customs Logic
    const renderCustoms = () => {
        const customs = getCustomColors();
        customsContainer.innerHTML = customs.map((color, index) => `
            <button class="custom-color-slot w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:scale-110 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400 relative overflow-hidden"
                style="background-color: ${color}" data-index="${index}" data-color="${color}">
                <div class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
            </button>
        `).join('');
    };
    renderCustoms();

    // Event Handler for color selection
    picker.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('button[data-color]');
        if (btn && !btn.classList.contains('custom-color-slot')) {
            // Preset clicked
            const color = (btn as HTMLElement).dataset.color;
            if (color) applyColor(color, picker);
        } else if (btn && btn.classList.contains('custom-color-slot')) {
            // Custom slot clicked
            activeCustomIndex = parseInt((btn as HTMLElement).dataset.index || '-1', 10);
            // Visual highlight for slot selection
            document.querySelectorAll('.custom-color-slot').forEach(b => b.classList.remove('ring-offset-2', 'ring-2', 'ring-blue-500'));
            btn.classList.add('ring-offset-2', 'ring-2', 'ring-blue-500');

            const color = (btn as HTMLElement).dataset.color;
            if (color && color !== '#E5E7EB') { // Apply if not default empty
                applyColor(color, picker);
            }
        }
    });

    // Custom Color Edit Logic
    editBtn.onclick = () => {
        if (activeCustomIndex === -1) activeCustomIndex = 0;
        customInput.click();
    };

    customInput.onchange = (e) => {
        if (activeCustomIndex === -1) activeCustomIndex = 0;
        const target = e.target as HTMLInputElement;
        const newColor = target.value;
        const customs = getCustomColors();
        customs[activeCustomIndex] = newColor;
        saveCustomColors(customs);
        renderCustoms();
        applyColor(newColor, picker);
    };
}

function applyColor(color: string, picker: HTMLElement) {
    if (activeColorTrigger) {
        activeColorTrigger.style.backgroundColor = color;
        activeColorTrigger.dataset.color = color;
        picker.classList.add('hidden');
    }
}

export function openColorPicker(triggerBtn: HTMLElement) {
    activeColorTrigger = triggerBtn;
    const picker = document.getElementById('tb-color-picker');
    if (!picker) return;

    // Position logic
    const rect = triggerBtn.getBoundingClientRect();

    // Find container to calculate relative position
    const container = document.getElementById('tb-scroll-container')?.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    let top = rect.bottom - containerRect.top + 10;
    let left = rect.left - containerRect.left;

    // Boundary check
    if (left + 280 > containerRect.width) {
        left = containerRect.width - 290;
    }

    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;
    picker.classList.remove('hidden');
}

export function closeColorPicker() {
    const picker = document.getElementById('tb-color-picker');
    if (picker) picker.classList.add('hidden');
}
