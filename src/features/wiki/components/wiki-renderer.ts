import { WikiFramework } from '../wiki-data';

export class WikiRenderer {
    private data: WikiFramework[];
    private onApplyToWizard: ((id: string) => void) | undefined;

    constructor(data: WikiFramework[], onApplyToWizard?: (id: string) => void) {
        this.data = data;
        this.onApplyToWizard = onApplyToWizard;
    }

    render(container: HTMLElement | null): void {
        if (!container) return;
        container.innerHTML = `
            <div class="max-w-5xl mx-auto py-8">
                <header class="mb-10 text-center">
                    <h2 class="font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Framework Wiki</h2>
                    <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        目標達成のための「思考の型」。あなたの状況に最適なフレームワークを見つけ、そのまま設計に活かしましょう。
                    </p>
                </header>
                
                <div class="space-y-8">
                    ${this.data.map(item => this._renderFrameworkItem(item)).join('')}
                </div>
            </div>
        `;

        this._setupEventListeners(container);
    }

    private _renderFrameworkItem(item: WikiFramework): string {
        // Color mapping for Tailwind classes
        const colors: Record<string, any> = {
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/10',
                border: 'border-blue-100 dark:border-blue-900/30',
                text: 'text-blue-700 dark:text-blue-400',
                iconBg: 'bg-blue-100 dark:bg-blue-900/40',
                btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            },
            amber: {
                bg: 'bg-amber-50 dark:bg-amber-900/10',
                border: 'border-amber-100 dark:border-amber-900/30',
                text: 'text-amber-700 dark:text-amber-400',
                iconBg: 'bg-amber-100 dark:bg-amber-900/40',
                btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/10',
                border: 'border-purple-100 dark:border-purple-900/30',
                text: 'text-purple-700 dark:text-purple-400',
                iconBg: 'bg-purple-100 dark:bg-purple-900/40',
                btn: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
            }
        };

        const c = colors[item.color] || colors.blue;

        return `
            <div class="framework-card bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md" data-id="${item.id}">
                <!-- Header (Always Visible) -->
                <div class="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl ${c.iconBg} flex items-center justify-center text-3xl shadow-inner">
                            ${item.icon}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                                ${item.title}
                                <span class="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text} uppercase tracking-wider">
                                    Framework
                                </span>
                            </h3>
                            <p class="text-gray-500 dark:text-gray-400 font-medium">${item.subTitle}</p>
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <button class="apply-btn w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white ${c.btn} shadow-lg shadow-${item.color}-500/30 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800" data-id="${item.id}">
                            <span>この手法で設計する</span>
                            <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Accordion Content (Multi-layer) -->
                <div class="bg-gray-50/50 dark:bg-gray-900/20">
                    <!-- Layer 1: Concept -->
                    ${this._renderAccordionSection(
            'Concept',
            '基本概念',
            `<p class="font-bold mb-2 text-gray-800 dark:text-gray-200">${item.concept.summary}</p>
                         <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${item.concept.detail}</p>`,
            item.color,
            true // Open by default
        )}

                    <!-- Layer 2: Use Cases -->
                    ${this._renderAccordionSection(
            'Use Case',
            '実践例 (Before/After)',
            `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${item.useCases.map(uc => `
                                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                                    <h5 class="font-bold text-gray-900 dark:text-white mb-3 text-center border-b border-gray-100 dark:border-gray-700 pb-2">${uc.title}</h5>
                                    <div class="space-y-3 text-sm">
                                        <div class="flex gap-2">
                                            <span class="flex-shrink-0 font-bold text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 h-fit mt-0.5">BEFORE</span>
                                            <p class="text-gray-500 dark:text-gray-400">${uc.before}</p>
                                        </div>
                                        <div class="flex gap-2">
                                            <span class="flex-shrink-0 font-bold text-xs px-2 py-0.5 rounded bg-${item.color}-100 dark:bg-${item.color}-900/40 text-${item.color}-600 dark:text-${item.color}-400 h-fit mt-0.5">AFTER</span>
                                            <p class="text-gray-800 dark:text-gray-200 font-medium">${uc.after}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`,
            item.color
        )}

                    <!-- Layer 3: Tips & Q&A -->
                    ${this._renderAccordionSection(
            'Tips',
            'コツとQ&A',
            `<div class="space-y-4">
                            ${item.tips.map(tip => `
                                <div class="flex gap-4">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold flex items-center justify-center text-sm">Q</div>
                                    <div class="space-y-2">
                                        <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mt-1.5">${tip.q}</p>
                                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg rounded-tl-none border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 leading-relaxed shadow-sm">
                                            <span class="font-bold text-${item.color}-500 mr-2">A.</span>
                                            ${tip.a}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`,
            item.color
        )}
                </div>
            </div>
        `;
    }

    private _renderAccordionSection(key: string, title: string, contentHtml: string, color: string, isOpen: boolean = false): string {
        // Unique ID for accordion state management
        const id = Math.random().toString(36).substr(2, 9);

        const openClass = isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0';
        const rotateClass = isOpen ? 'rotate-180' : 'rotate-0';
        const bgClass = isOpen ? 'bg-white dark:bg-gray-800 shadow-md scale-[1.01]' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50';
        const highlightClass = isOpen ? `border-l-4 border-${color}-500` : `border-l-4 border-transparent`;

        return `
            <div class="accordion-item group border-t border-gray-100 dark:border-gray-700 transition-all duration-300 ${bgClass} ${highlightClass}" data-is-open="${isOpen}">
                <button class="accordion-header w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none" onclick="this.closest('.accordion-item').classList.toggle('active')">
                    <div class="flex items-center gap-3">
                        <span class="uppercase text-xs font-bold text-gray-400 tracking-wider w-16 text-right">${key}</span>
                        <span class="font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            ${title}
                        </span>
                    </div>
                    <svg class="chevron w-5 h-5 text-gray-400 transform transition-transform duration-300 ${rotateClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="accordion-content overflow-hidden transition-all duration-500 ease-in-out ${openClass}">
                    <div class="px-6 pb-6 pt-2 pl-[5.5rem]">
                        ${contentHtml}
                    </div>
                </div>
            </div>
        `;
    }

    private _setupEventListeners(container: HTMLElement): void {
        // Accordion Logic
        container.querySelectorAll<HTMLElement>('.accordion-header').forEach(header => {
            header.onclick = (e) => {
                e.preventDefault(); // Prevent default if necessary
                const item = header.closest('.accordion-item') as HTMLElement;
                if (!item) return;

                const content = item.querySelector('.accordion-content') as HTMLElement;
                const chevron = item.querySelector('.chevron') as HTMLElement;

                // Null check
                if (!content || !chevron) {
                    console.warn('Accordion elements not found', { content, chevron });
                    return;
                }

                const isClosed = content.classList.contains('max-h-0');

                // Toggle classes
                if (isClosed) {
                    content.classList.remove('max-h-0', 'opacity-0');
                    content.classList.add('max-h-[1000px]', 'opacity-100'); // Use arbitrary large value for max-h
                    chevron.classList.add('rotate-180');

                    // Style updates for active state
                    item.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-800/50', 'border-transparent');
                    item.classList.add('bg-white', 'dark:bg-gray-800', 'shadow-md', 'scale-[1.01]');

                    // Add border color dynamically based on framework color (simplified here, ideally pass color)
                    // We can find the parent card's color intent or class

                    // Scroll into view if needed
                    setTimeout(() => {
                        const rect = item.getBoundingClientRect();
                        if (rect.top < 0 || rect.bottom > window.innerHeight) {
                            item.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                        }
                    }, 300);

                } else {
                    content.classList.add('max-h-0', 'opacity-0');
                    content.classList.remove('max-h-[1000px]', 'opacity-100');
                    chevron.classList.remove('rotate-180');

                    // Reset styles
                    item.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-800/50', 'border-transparent');
                    item.classList.remove('bg-white', 'dark:bg-gray-800', 'shadow-md', 'scale-[1.01]');
                }
            };
        });

        // Apply Button Logic
        container.querySelectorAll<HTMLElement>('.apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modeId = btn.dataset.id;
                if (modeId && this.onApplyToWizard) {
                    this.onApplyToWizard(modeId);
                }
            });
        });
    }
}
