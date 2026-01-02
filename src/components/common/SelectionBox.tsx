
interface SelectionBoxProps<T> {
    title: string;
    items: T[];
    selectedItems: string[];
    onToggle: (id: string) => void;
    labelFn?: (item: T) => string;
}

export function SelectionBox<T extends { id?: string; name?: string }>({
    title,
    items,
    selectedItems,
    onToggle,
    labelFn = (i: T) => i.name ?? i.id ?? String(i)
}: SelectionBoxProps<T>) {
    return (
        <div className="flex flex-col min-h-[10rem] max-h-64 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
                {title}
            </div>
            <div className="p-2 overflow-y-auto space-y-1 custom-scrollbar flex-1">
                {items.map((item) => {
                    const id = item.id || item.toString();
                    const isChecked = selectedItems.includes(id);
                    const inputId = `filter-${title.replace(/ /g, '-')}-${id}`;
                    const label = labelFn(item);
                    return (
                        <div
                            key={id}
                            className="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            onClick={() => onToggle(id)}
                        >
                            <input
                                id={inputId}
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => { }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                aria-label={`${title}: ${label}`}
                            />
                            <label htmlFor={inputId} className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate flex-1 cursor-pointer pointer-events-none">
                                {label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
