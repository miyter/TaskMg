export interface KGIStatus {
    title: string;
    progress: number;
    daysLeft: number;
    status: 'good' | 'warning' | 'danger';
}

export interface Milestone {
    id?: string;
    date: string;
    title: string;
    type: 'goal' | 'milestone' | 'current' | 'action';
    completed: boolean;
}

export interface BackwardData {
    milestones: Milestone[];
}

export interface Obstacle {
    id: number;
    text: string;
    plan: string;
    overcomeCount: number;
}

export interface WoopData {
    wish: string;
    outcome: string;
    obstacles: Obstacle[];
}

export interface KeyResult {
    id: number;
    text: string;
    current: number;
    target: number;
    confidence: 'high' | 'medium' | 'low';
}

export interface OkrData {
    objective: string;
    keyResults: KeyResult[];
}

export interface DashboardData {
    kgi: KGIStatus;
    backward: BackwardData;
    woop: WoopData;
    okr: OkrData;
}
