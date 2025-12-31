/**
 * search.ts (filterTasks, getProcessedTasks) の単体テスト
 */

import { describe, expect, it } from 'vitest';
import { Task } from '../../store/schema';
import { filterTasks, getProcessedTasks, SearchConfig } from '../search';

// テスト用タスクファクトリー
function createTask(overrides: Partial<Task> = {}): Task {
    return {
        id: 'task-1',
        title: 'Test Task',
        status: 'todo',
        ownerId: 'user-1',
        description: null,
        projectId: null,
        labelIds: [],
        timeBlockId: null,
        duration: undefined,
        isImportant: false,
        recurrence: null,
        ...overrides,
    };
}

describe('filterTasks', () => {
    describe('Status filtering', () => {
        const tasks = [
            createTask({ id: '1', status: 'todo' }),
            createTask({ id: '2', status: 'completed' }),
            createTask({ id: '3', status: 'todo' }),
        ];

        it('should filter by active status', () => {
            const result = filterTasks(tasks, { status: ['active'], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(2);
            expect(result.every(t => t.status === 'todo')).toBe(true);
        });

        it('should filter by completed status', () => {
            const result = filterTasks(tasks, { status: ['completed'], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].status).toBe('completed');
        });

        it('should exclude completed status', () => {
            const result = filterTasks(tasks, { excludeStatus: ['completed'], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], isImportant: undefined });
            expect(result).toHaveLength(2);
            expect(result.every(t => t.status !== 'completed')).toBe(true);
        });
    });

    describe('Project filtering', () => {
        const tasks = [
            createTask({ id: '1', projectId: 'project-a' }),
            createTask({ id: '2', projectId: 'project-b' }),
            createTask({ id: '3', projectId: null }),
        ];

        it('should filter by specific project', () => {
            const result = filterTasks(tasks, { projects: ['project-a'], keywords: [], excludeKeywords: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].projectId).toBe('project-a');
        });

        it('should filter unassigned projects', () => {
            const result = filterTasks(tasks, { projects: ['unassigned'], keywords: [], excludeKeywords: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].projectId).toBeNull();
        });

        it('should exclude specific project', () => {
            const result = filterTasks(tasks, { excludeProjects: ['project-a'], keywords: [], excludeKeywords: [], projects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(2);
            expect(result.every(t => t.projectId !== 'project-a')).toBe(true);
        });
    });

    describe('Label filtering', () => {
        const tasks = [
            createTask({ id: '1', labelIds: ['urgent', 'bug'] }),
            createTask({ id: '2', labelIds: ['feature'] }),
            createTask({ id: '3', labelIds: [] }),
        ];

        it('should filter by label', () => {
            const result = filterTasks(tasks, { labels: ['urgent'], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].labelIds).toContain('urgent');
        });

        it('should exclude by label', () => {
            const result = filterTasks(tasks, { excludeLabels: ['urgent'], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(2);
        });
    });

    describe('Importance filtering', () => {
        const tasks = [
            createTask({ id: '1', isImportant: true }),
            createTask({ id: '2', isImportant: false }),
            createTask({ id: '3', isImportant: true }),
        ];

        it('should filter important tasks', () => {
            const result = filterTasks(tasks, { isImportant: true, keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [] });
            expect(result).toHaveLength(2);
            expect(result.every(t => t.isImportant)).toBe(true);
        });

        it('should filter non-important tasks', () => {
            const result = filterTasks(tasks, { isImportant: false, keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [] });
            expect(result).toHaveLength(1);
            expect(result[0].isImportant).toBe(false);
        });
    });

    describe('Keyword filtering', () => {
        const tasks = [
            createTask({ id: '1', title: 'Meeting with team', description: 'Discuss project' }),
            createTask({ id: '2', title: 'Buy groceries', description: null }),
            createTask({ id: '3', title: 'Code review', description: 'Review team PRs' }),
        ];

        it('should filter by keyword in title', () => {
            const result = filterTasks(tasks, { keywords: ['meeting'], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].title).toContain('Meeting');
        });

        it('should filter by keyword in description', () => {
            const result = filterTasks(tasks, { keywords: ['project'], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
        });

        it('should exclude by keyword', () => {
            const result = filterTasks(tasks, { excludeKeywords: ['team'], keywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], durations: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Buy groceries');
        });
    });

    describe('Duration filtering', () => {
        const tasks = [
            createTask({ id: '1', duration: 30 }),
            createTask({ id: '2', duration: 60 }),
            createTask({ id: '3', duration: undefined }),
        ];

        it('should filter by duration', () => {
            const result = filterTasks(tasks, { durations: [30], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].duration).toBe(30);
        });

        it('should match tasks with no duration when filtering for 0', () => {
            const result = filterTasks(tasks, { durations: [0], keywords: [], excludeKeywords: [], projects: [], excludeProjects: [], labels: [], excludeLabels: [], timeBlocks: [], excludeTimeBlocks: [], dates: [], status: [], excludeStatus: [], isImportant: undefined });
            expect(result).toHaveLength(1);
        });
    });
});

describe('getProcessedTasks', () => {
    const tasks = [
        createTask({ id: '1', title: 'Task A', status: 'todo', isImportant: true }),
        createTask({ id: '2', title: 'Task B', status: 'completed' }),
        createTask({ id: '3', title: 'Task C', status: 'todo', projectId: 'project-1' }),
    ];

    it('should filter and sort tasks based on config', () => {
        const config: SearchConfig = {
            showCompleted: false,
        };
        const result = getProcessedTasks(tasks, config);
        expect(result).toHaveLength(2);
        expect(result.every(t => t.status !== 'completed')).toBe(true);
    });

    it('should include completed when showCompleted is true', () => {
        const config: SearchConfig = {
            showCompleted: true,
        };
        const result = getProcessedTasks(tasks, config);
        expect(result).toHaveLength(3);
    });

    it('should filter by projectId', () => {
        const config: SearchConfig = {
            showCompleted: true,
            projectId: 'project-1',
        };
        const result = getProcessedTasks(tasks, config);
        expect(result).toHaveLength(1);
        expect(result[0].projectId).toBe('project-1');
    });

    it('should filter important tasks via filterType', () => {
        const config: SearchConfig = {
            showCompleted: true,
            filterType: 'important',
        };
        const result = getProcessedTasks(tasks, config);
        expect(result).toHaveLength(1);
        expect(result[0].isImportant).toBe(true);
    });

    it('should apply keyword filter', () => {
        const config: SearchConfig = {
            showCompleted: true,
            keyword: 'Task A',
        };
        const result = getProcessedTasks(tasks, config);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Task A');
    });
});
