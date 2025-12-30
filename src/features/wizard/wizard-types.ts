import { WizardModeId } from './wizard-config';

export interface WizardState {
    mode: WizardModeId;
    step: number; // 0: Welcome, 1~N: Steps
    data: Record<string, any>; // 入力データを保持
}
