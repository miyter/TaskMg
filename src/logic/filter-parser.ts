export interface FilterConditions {
    keywords: string[];
    projects: string[]; // projectId
    labels: string[]; // labelId
    timeBlocks: string[]; // timeBlockId
    durations: number[]; // Change string[] to number[]
    dates: string[]; // 'today', 'tomorrow', 'week', 'upcoming', 'overdue', etc.
    status: string[]; // 'completed', etc.
    isImportant?: boolean; // Explicit flag
}

export function parseFilterQuery(query: string): FilterConditions {
    const conditions: FilterConditions = {
        keywords: [],
        projects: [],
        labels: [],
        timeBlocks: [],
        durations: [],
        dates: [],
        status: [],
        isImportant: false
    };


    if (!query) return conditions;

    // Regex to match:
    // 1. key:"quoted value" -> ([a-zA-Z]+:"[^"]*")
    // 2. key:value        -> ([a-zA-Z]+:[^\s]+)
    // 3. "phrase"          -> ("[^"]*")
    // 4. word             -> ([^\s]+)
    // Updated to better handle spaces within quotes
    const regex = /(?:[a-zA-Z]+:(?:"[^"]*"|[^\s]+))|(?:"[^"]*")|(?:[^\s]+)/g;
    const matches = query.match(regex);

    if (!matches) return conditions;

    matches.forEach(part => {
        // Handle phrase search (entirely quoted)
        if (part.startsWith('"') && part.endsWith('"')) {
            const phrase = part.substring(1, part.length - 1);
            if (phrase) conditions.keywords.push(phrase.toLowerCase());
            return;
        }

        if (part.includes(':')) {
            const colonIndex = part.indexOf(':');
            const key = part.substring(0, colonIndex).toLowerCase();
            let val = part.substring(colonIndex + 1);

            // Strip quotes from value if present
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
            }
            const lowerVal = val.toLowerCase();

            switch (key) {
                case 'project':
                case 'p':
                    conditions.projects.push(val);
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
                    const d = parseInt(val, 10);
                    if (!isNaN(d)) conditions.durations.push(d);
                    break;
                case 'date':
                case 'due':
                    const validDates = ['today', 'tomorrow', 'week', 'upcoming', 'overdue'];
                    if (validDates.includes(lowerVal)) {
                        conditions.dates.push(lowerVal);
                    }
                    break;
                case 'status':
                case 'is':
                    const validStatus = ['completed', 'active', 'todo'];
                    if (validStatus.includes(lowerVal)) {
                        conditions.status.push(lowerVal);
                    }
                    if (lowerVal === 'important') {
                        conditions.isImportant = true;
                    }
                    break;
                default:
                    // Unknown prefix treated as keyword
                    conditions.keywords.push(part.toLowerCase());
                    break;
            }
        } else {
            conditions.keywords.push(part.toLowerCase());
        }
    });

    return conditions;
}
