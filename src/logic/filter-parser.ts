export interface FilterConditions {
    keywords: string[];
    projects: string[]; // projectId
    labels: string[]; // labelId
    timeBlocks: string[]; // timeBlockId
    durations: string[];
    dates: string[]; // 'today', 'tomorrow', 'week', etc.
    status: string[]; // 'completed', etc.
}

export function parseFilterQuery(query: string): FilterConditions {
    const conditions: FilterConditions = {
        keywords: [],
        projects: [],
        labels: [],
        timeBlocks: [],
        durations: [],
        dates: [],
        status: []
    };

    if (!query) return conditions;

    const parts = query.trim().split(/\s+/);
    parts.forEach(part => {
        if (!part) return;

        if (part.includes(':')) {
            const [key, val] = part.split(':');
            const lowerVal = val.toLowerCase();

            switch (key.toLowerCase()) {
                case 'project':
                case 'p':
                    conditions.projects.push(val); // Keep case for ID? Assuming sensitive or normalized elsewhere.
                    break;
                case 'label':
                case 'l':
                    conditions.labels.push(val);
                    break;
                case 'timeblock':
                case 'tb':
                    conditions.timeBlocks.push(val);
                    break;
                case 'duration':
                case 'd':
                    conditions.durations.push(val);
                    break;
                case 'date':
                case 'due':
                    conditions.dates.push(lowerVal);
                    break;
                case 'status':
                case 'is':
                    conditions.status.push(lowerVal);
                    break;
                default:
                    // Unknown prefix treated as keyword or ignored?
                    // For now, treat as keyword including the prefix to be safe, or just ignore prefix.
                    conditions.keywords.push(part.toLowerCase());
                    break;
            }
        } else {
            conditions.keywords.push(part.toLowerCase());
        }
    });

    return conditions;
}
