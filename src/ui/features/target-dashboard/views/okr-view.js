export function renderOkrView(data) {
    const getConfidenceColor = (conf) => {
        if (conf === 'high') return 'bg-emerald-500';
        if (conf === 'medium') return 'bg-amber-500';
        return 'bg-red-500';
    };

    return `
        <div class="max-w-4xl mx-auto">
            <!-- Objective (Root) -->
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-primary-100 dark:border-primary-900 shadow-lg text-center mb-12 relative z-10">
                <div class="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Objective
                </div>
                <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                    "${data.objective}"
                </h2>
                
                <!-- Connector Line -->
                <div class="absolute bottom-[-50px] left-1/2 w-1 h-[50px] bg-gray-200 dark:bg-gray-700 z-0"></div>
            </div>

            <!-- Key Results (Branches) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <!-- Horizontal Connector (Desktop only) -->
                <div class="hidden md:block absolute top-[-25px] left-[16.66%] right-[16.66%] h-1 bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 rounded-t-xl z-0"></div>

                ${data.keyResults.map(kr => {
        const percent = Math.round((kr.current / kr.target) * 100);
        const confColor = getConfidenceColor(kr.confidence);

        return `
                        <div class="relative pt-6">
                            <!-- Vertical connector to branch -->
                            <div class="absolute top-[-25px] left-1/2 w-1 h-[25px] bg-gray-200 dark:bg-gray-700 md:block hidden"></div>
                            
                            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group h-full">
                                <div class="flex justify-between items-start mb-3">
                                    <span class="text-xs font-bold text-gray-400">KR #${kr.id}</span>
                                    <div class="w-3 h-3 rounded-full ${confColor}" title="Confidence: ${kr.confidence}"></div>
                                </div>
                                
                                <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-4 h-12 line-clamp-2">
                                    ${kr.text}
                                </h4>
                                
                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs font-bold text-gray-500">
                                        <span>${kr.current}</span>
                                        <span>${kr.target}</span>
                                    </div>
                                    <div class="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                        <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                                    </div>
                                    <div class="text-right text-sm font-black text-blue-600 mt-1">${percent}%</div>
                                </div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}
