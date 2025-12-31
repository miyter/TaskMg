import {
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { SortableItem } from '../common/SortableItem';

import { SidebarLoadingState } from '../common/SidebarLoadingState';

export const ProjectList: React.FC = () => {
    const { projects, loading } = useProjects();

    if (loading) {
        return <SidebarLoadingState />;
    }

    if (projects.length === 0) {
        return <div className="p-4 text-xs text-gray-400">プロジェクトはありません</div>;
    }

    return (
        <SortableContext
            items={projects.map(p => p.id!)}
            strategy={verticalListSortingStrategy}
        >
            <div className="space-y-0.5 p-2">
                {projects.map((project) => (
                    <SortableItem key={project.id} id={project.id!}>
                        <ProjectItem project={project} />
                    </SortableItem>
                ))}
            </div>
        </SortableContext>
    );
};

// Extracted for cleaner click handling vs dnd
import { Project } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';

import { useModalStore } from '../../store/ui/modal-store';

const ProjectItem = React.memo<{ project: Project }>(({ project }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const { density } = useSettingsStore();
    const { openModal } = useModalStore();

    const isActive = filterType === 'project' && targetId === project.id;

    const { setNodeRef, isOver } = useDroppable({
        id: `project:${project.id}`,
        data: {
            type: 'project',
            value: project.id
        }
    });

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        openModal('project-edit', project);
    };

    return (
        <div
            ref={setNodeRef}
            onClick={() => setFilter('project', project.id)}
            className={cn(
                "group flex items-center justify-between px-2 rounded-md cursor-pointer transition-colors select-none",
                getDensityClass(density),
                isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                isOver && "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50"
            )}
            role="button"
            tabIndex={0}
            aria-selected={isActive}
            aria-label={`Project: ${project.name}`}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={cn("text-xs shrink-0 transition-colors", isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500")}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                </span>
                <span className="text-sm truncate">{project.name}</span>
            </div>

            {/* Edit Button (Shows on Hover) */}
            <button
                onClick={handleEdit}
                className={cn(
                    "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                )}
                aria-label={`Edit ${project.name}`}
                title="編集"
            >
                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
        </div>
    );
}, (prev, next) => {
    // 比較関数の更新（プロジェクトのプロパティだけでなく、選択状態も比較に含めるべきだが、
    // useFilterStoreはフック内で取得しているので、propsには含まれない。
    // React.memoの比較はpropsに対してのみ。
    // そのため、storeからの値を使っている以上、常に再レンダリングが必要な場合があるが、
    // ここでは単純化のためにプロジェクトデータのみ比較している。
    // 選択状態が変わったときに正しく再描画されるか確認が必要。
    // -> isActiveは内部で計算されているため、selectorが変われば再描画されるはず。
    // -> しかしReact.memoで囲まれていると、親から渡されるpropsが変わらない限り再実行されない。
    // -> FilterStoreの変更を検知できない可能性がある。
    // -> 修正: useFilterStoreを使っているので、このコンポーネント自体は再レンダリングされる。
    // -> しかしReact.memoの第二引数がtrueを返すと再レンダリングをスキップしてしまう。
    // -> そのため、カスタム比較関数は危険。削除するか、正しく実装する必要がある。
    // ここでは安全のため、一旦カスタム比較ロジックを削除してReact.memoのみにするのが無難だが、
    // 既存コードに倣い、JSON比較を維持しつつ、isActiveに関連する変更は検知できないリスクがある。
    // しかし、上位からisActiveをpropsとして渡していないため、このコンポーネントは内部のhooksによってのみstate変更を検知する。
    // React.memoはpropsの変更のみを制御する。
    // 内部hooks (useFilterStore) が更新をトリガーした場合、React.memoは関係なく再レンダリングされるはず。
    return JSON.stringify(prev.project) === JSON.stringify(next.project);
});
