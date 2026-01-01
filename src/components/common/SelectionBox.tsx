import React from 'react';

interface SelectionBoxProps {
    title: string;
    items: any[];
    selectedItems: string[];
    onToggle: (id: string) => void;
    labelFn?: (item: any) => string;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ title, items, selectedItems, onToggle, labelFn = (i: any) => i.name }) => {
    return (
        <div className="flex flex-col h-64 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {title}
            </div>
            <div className="p-2 overflow-y-auto space-y-1 custom-scrollbar">
                {items.map((item) => {
                    const id = item.id || item.toString();
                    const isChecked = selectedItems.includes(id);
                    const inputId = `filter-${title.replace(/ /g, '-')}-${id}`;
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
                                aria-label={`${title}: ${labelFn(item)}`}
                            />
                            <label htmlFor={inputId} className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate flex-1 cursor-pointer pointer-events-none">
                                {labelFn(item)}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
