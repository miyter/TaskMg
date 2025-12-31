/**
 * filter-parser.ts の単体テスト
 */

import { describe, expect, it } from 'vitest';
import { parseFilterQuery } from '../filter-parser';

describe('parseFilterQuery', () => {
    // 空のクエリ
    describe('Empty queries', () => {
        it('should return empty conditions for empty string', () => {
            const result = parseFilterQuery('');
            expect(result.keywords).toEqual([]);
            expect(result.projects).toEqual([]);
        });

        it('should return empty conditions for whitespace only', () => {
            const result = parseFilterQuery('   ');
            expect(result.keywords).toEqual([]);
        });
    });

    // キーワード検索
    describe('Keyword search', () => {
        it('should parse single keyword', () => {
            const result = parseFilterQuery('meeting');
            expect(result.keywords).toContain('meeting');
        });

        it('should parse multiple keywords', () => {
            const result = parseFilterQuery('meeting report');
            expect(result.keywords).toContain('meeting');
            expect(result.keywords).toContain('report');
        });

        it('should parse quoted phrase as single keyword', () => {
            const result = parseFilterQuery('"meeting report"');
            expect(result.keywords).toContain('meeting report');
        });

        it('should parse excluded keyword with -', () => {
            const result = parseFilterQuery('-draft');
            expect(result.excludeKeywords).toContain('draft');
            expect(result.keywords).not.toContain('draft');
        });
    });

    // プロジェクトフィルタ
    describe('Project filter', () => {
        it('should parse project:value', () => {
            const result = parseFilterQuery('project:work');
            expect(result.projects).toContain('work');
        });

        it('should parse p:value shorthand', () => {
            const result = parseFilterQuery('p:personal');
            expect(result.projects).toContain('personal');
        });

        it('should parse -project:value for exclusion', () => {
            const result = parseFilterQuery('-project:archived');
            expect(result.excludeProjects).toContain('archived');
        });

        it('should handle quoted project names', () => {
            const result = parseFilterQuery('project:"My Project"');
            expect(result.projects).toContain('My Project');
        });
    });

    // ラベルフィルタ
    describe('Label filter', () => {
        it('should parse label:value', () => {
            const result = parseFilterQuery('label:urgent');
            expect(result.labels).toContain('urgent');
        });

        it('should parse l:value shorthand', () => {
            const result = parseFilterQuery('l:bug');
            expect(result.labels).toContain('bug');
        });

        it('should parse -label:value for exclusion', () => {
            const result = parseFilterQuery('-l:wontfix');
            expect(result.excludeLabels).toContain('wontfix');
        });
    });

    // タイムブロックフィルタ
    describe('TimeBlock filter', () => {
        it('should parse timeblock:value', () => {
            const result = parseFilterQuery('timeblock:morning');
            expect(result.timeBlocks).toContain('morning');
        });

        it('should parse tb:value shorthand', () => {
            const result = parseFilterQuery('tb:afternoon');
            expect(result.timeBlocks).toContain('afternoon');
        });

        it('should parse -tb:value for exclusion', () => {
            const result = parseFilterQuery('-tb:night');
            expect(result.excludeTimeBlocks).toContain('night');
        });
    });

    // 所要時間フィルタ
    describe('Duration filter', () => {
        it('should parse duration:30', () => {
            const result = parseFilterQuery('duration:30');
            expect(result.durations).toContain(30);
        });

        it('should parse d:60 shorthand', () => {
            const result = parseFilterQuery('d:60');
            expect(result.durations).toContain(60);
        });

        it('should ignore invalid duration', () => {
            const result = parseFilterQuery('duration:invalid');
            expect(result.durations).toEqual([]);
        });
    });

    // 日付フィルタ
    describe('Date filter', () => {
        it('should parse date:today', () => {
            const result = parseFilterQuery('date:today');
            expect(result.dates).toContain('today');
        });

        it('should parse due:tomorrow', () => {
            const result = parseFilterQuery('due:tomorrow');
            expect(result.dates).toContain('tomorrow');
        });

        it('should parse date:week', () => {
            const result = parseFilterQuery('date:week');
            expect(result.dates).toContain('week');
        });

        it('should parse date:upcoming', () => {
            const result = parseFilterQuery('date:upcoming');
            expect(result.dates).toContain('upcoming');
        });

        it('should parse date:overdue', () => {
            const result = parseFilterQuery('date:overdue');
            expect(result.dates).toContain('overdue');
        });

        it('should ignore invalid date values', () => {
            const result = parseFilterQuery('date:invalid');
            expect(result.dates).toEqual([]);
        });
    });

    // ステータスフィルタ
    describe('Status filter', () => {
        it('should parse status:completed', () => {
            const result = parseFilterQuery('status:completed');
            expect(result.status).toContain('completed');
        });

        it('should parse is:active', () => {
            const result = parseFilterQuery('is:active');
            expect(result.status).toContain('active');
        });

        it('should parse -status:completed for exclusion', () => {
            const result = parseFilterQuery('-status:completed');
            expect(result.excludeStatus).toContain('completed');
        });

        it('should parse is:important', () => {
            const result = parseFilterQuery('is:important');
            expect(result.isImportant).toBe(true);
        });

        it('should parse -is:important', () => {
            const result = parseFilterQuery('-is:important');
            expect(result.isImportant).toBe(false);
        });

        it('should parse is:unimportant', () => {
            const result = parseFilterQuery('is:unimportant');
            expect(result.isImportant).toBe(false);
        });
    });

    // 複合クエリ
    describe('Complex queries', () => {
        it('should parse combined filters', () => {
            const result = parseFilterQuery('project:work label:urgent date:today meeting');
            expect(result.projects).toContain('work');
            expect(result.labels).toContain('urgent');
            expect(result.dates).toContain('today');
            expect(result.keywords).toContain('meeting');
        });

        it('should parse mixed include and exclude', () => {
            const result = parseFilterQuery('project:work -project:archived -draft');
            expect(result.projects).toContain('work');
            expect(result.excludeProjects).toContain('archived');
            expect(result.excludeKeywords).toContain('draft');
        });
    });

    // 未知のプレフィックス
    describe('Unknown prefix handling', () => {
        it('should treat unknown prefix as keyword', () => {
            const result = parseFilterQuery('custom:value');
            expect(result.keywords).toContain('custom:value');
        });

        it('should treat -unknown:value as excluded keyword', () => {
            const result = parseFilterQuery('-custom:value');
            expect(result.excludeKeywords).toContain('custom:value');
        });
    });
});
