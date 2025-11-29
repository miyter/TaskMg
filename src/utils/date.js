export function getTaskDateColor(dueDate) {
    if (!dueDate) return 'text-gray-400';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-600 font-medium';
    if (diffDays === 0) return 'text-green-600 font-medium';
    if (diffDays === 1) return 'text-orange-600';
    return 'text-gray-500';
}

export function formatDateCompact(dueDate) {
    if (!dueDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dateOnly - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${date.getMonth() + 1}/${date.getDate()}`;
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays < 7) return `${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}曜日`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
}