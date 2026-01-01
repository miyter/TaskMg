export interface FilterConditions {
    keywords: (string | string[])[];
    excludeKeywords: string[];
    projects: string[]; // projectId
    excludeProjects: string[];
    labels: string[]; // labelId
    excludeLabels: string[];
    timeBlocks: string[];
    excludeTimeBlocks: string[];
    durations: number[];
    dates: string[];
    status: string[];
    excludeStatus: string[];
    isImportant?: boolean | null; // true: important, false: unimportant, null/undefined: any
}

export function parseFilterQuery(query: string): FilterConditions {
    const conditions: FilterConditions = {
        keywords: [],
        excludeKeywords: [],
        projects: [],
        excludeProjects: [],
        labels: [],
        excludeLabels: [],
        timeBlocks: [],
        excludeTimeBlocks: [],
        durations: [],
        dates: [],
        status: [],
        excludeStatus: [],
        isImportant: undefined
    };

    if (!query) return conditions;

    // Regex to match:
    // 1. -key:"value" or key:"value" -> (-?[a-zA-Z]+:"[^"]*")
    // 2. -key:value or key:value     -> (-?[a-zA-Z]+:[^\s]+)
    // 3. "phrase"                     -> ("[^"]*")
    // 4. -word or word               -> (-?[^\s]+)
    const regex = /(?:-?[a-zA-Z]+:(?:"[^"]*"|[^\s]+))|(?:"[^"]*")|(?:-?[^\s]+)/g;
    const matches = query.match(regex);

    if (!matches) return conditions;

    // Pre-processing to handle OR operator
    // Group keywords joined by OR into arrays
    const tokens: (string | string[])[] = [];
    for (let i = 0; i < matches.length; i++) {
        const part = matches[i];

        // Is this an OR operator?
        if (part === 'OR') {
            const prevTokenIndex = tokens.length - 1;
            const prevToken = tokens[prevTokenIndex];
            const nextPart = matches[i + 1];

            // Check if previous token is a keyword (or an OR-group of keywords)
            // AND next token exists and is a keyword (not a property filter)
            // Property filters contain ':' (simplified check)
            const isPrevKeyword = prevToken && (typeof prevToken === 'string' ? !prevToken.includes(':') : true); // Array is always keyword group
            const isNextKeyword = nextPart && !nextPart.includes(':') && nextPart !== 'OR';

            if (isPrevKeyword && isNextKeyword) {
                // Combine into OR group
                const group: string[] = Array.isArray(prevToken) ? prevToken : [prevToken as string];
                group.push(nextPart.toLowerCase().replace(/^"|"$/g, '')); // Normalize next part

                // Update previous token with new group
                tokens[prevTokenIndex] = group;

                // Skip next part in validation loop since we consumed it
                i++;
                continue;
            }
        }

        // Normal token processing
        tokens.push(part);
    }

    tokens.forEach(token => {
        // If token is an array, it's an OR-group of keywords
        if (Array.isArray(token)) {
            conditions.keywords.push(token);
            return;
        }

        const part = token as string;

        // Handle phrase search (entirely quoted)
        if (part.startsWith('"') && part.endsWith('"')) {
            const phrase = part.substring(1, part.length - 1);
            if (phrase) conditions.keywords.push(phrase.toLowerCase());
            return;
        }

        // Handle negation for simple words (e.g. -bug)
        if (part.startsWith('-') && !part.includes(':')) {
            const word = part.substring(1);
            if (word) conditions.excludeKeywords.push(word.toLowerCase());
            return;
        }

        if (part.includes(':')) {
            let isNegative = false;
            let tokenStr = part;
            if (tokenStr.startsWith('-')) {
                isNegative = true;
                tokenStr = tokenStr.substring(1);
            }

            const colonIndex = tokenStr.indexOf(':');
            const key = tokenStr.substring(0, colonIndex).toLowerCase();
            let val = tokenStr.substring(colonIndex + 1);

            // Strip quotes from value if present
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
            }
            const lowerVal = val.toLowerCase();

            switch (key) {
                case 'project':
                case 'p':
                    if (isNegative) val.split(',').forEach(v => conditions.excludeProjects.push(v));
                    else val.split(',').forEach(v => conditions.projects.push(v));
                    break;
                case 'label':
                case 'l':
                    if (isNegative) val.split(',').forEach(v => conditions.excludeLabels.push(v));
                    else val.split(',').forEach(v => conditions.labels.push(v));
                    break;
                case 'timeblock':
                case 'tb':
                    if (isNegative) val.split(',').forEach(v => conditions.excludeTimeBlocks.push(v));
                    else val.split(',').forEach(v => conditions.timeBlocks.push(v));
                    break;
                case 'duration':
                case 'd':
                    val.split(',').forEach(v => {
                        const d = parseInt(v, 10);
                        if (!isNaN(d)) conditions.durations.push(d);
                    });
                    break;
                case 'date':
                case 'due':
                    const validDates = ['today', 'tomorrow', 'week', 'upcoming', 'overdue', 'next-week'];
                    val.split(',').forEach(v => {
                        const lowerV = v.toLowerCase();
                        if (validDates.includes(lowerV)) {
                            conditions.dates.push(lowerV);
                        }
                    });
                    break;
                case 'status':
                case 'is':
                    const validStatus = ['completed', 'active', 'todo'];
                    val.split(',').forEach(v => {
                        const lowerV = v.toLowerCase();
                        if (validStatus.includes(lowerV)) {
                            if (isNegative) conditions.excludeStatus.push(lowerV);
                            else conditions.status.push(lowerV);
                        }
                        if (lowerV === 'important') {
                            conditions.isImportant = !isNegative;
                        }
                        if (lowerV === 'unimportant') {
                            conditions.isImportant = isNegative; // -is:unimportant -> isImportant=true
                        }
                    });
                    break;
                default:
                    // Unknown prefix treated as keyword
                    if (isNegative) conditions.excludeKeywords.push(tokenStr.toLowerCase());
                    else conditions.keywords.push(tokenStr.toLowerCase());
                    break;
            }
        } else {
            if (part !== 'OR') { // Ignore standalone OR if skipped by logic
                conditions.keywords.push(part.toLowerCase());
            }
        }
    });

    return conditions;
}

export function stringifyFilterConditions(conditions: Partial<FilterConditions>): string {
    const parts: string[] = [];

    // Keywords
    if (conditions.keywords?.length) parts.push(...conditions.keywords.map(k => Array.isArray(k) ? k.join(' OR ') : k.includes(' ') ? `"${k}"` : k));
    if (conditions.excludeKeywords?.length) parts.push(...conditions.excludeKeywords.map(k => `-${k}`));

    // Projects
    if (conditions.projects?.length) parts.push(`project:${conditions.projects.join(',')}`);
    if (conditions.excludeProjects?.length) parts.push(`-project:${conditions.excludeProjects.join(',')}`);

    // Labels
    if (conditions.labels?.length) parts.push(`label:${conditions.labels.join(',')}`);
    if (conditions.excludeLabels?.length) parts.push(`-label:${conditions.excludeLabels.join(',')}`);

    // TimeBlocks
    if (conditions.timeBlocks?.length) parts.push(`timeblock:${conditions.timeBlocks.join(',')}`);
    if (conditions.excludeTimeBlocks?.length) parts.push(`-timeblock:${conditions.excludeTimeBlocks.join(',')}`);

    // Durations
    if (conditions.durations?.length) parts.push(`duration:${conditions.durations.join(',')}`);

    // Dates
    if (conditions.dates?.length) parts.push(`date:${conditions.dates.join(',')}`);

    // Status
    if (conditions.status?.length) parts.push(`status:${conditions.status.join(',')}`);
    if (conditions.excludeStatus?.length) parts.push(`-status:${conditions.excludeStatus.join(',')}`);

    // Important
    if (conditions.isImportant === true) parts.push('is:important');
    if (conditions.isImportant === false) parts.push('is:unimportant');

    return parts.join(' ');
}
