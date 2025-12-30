import React, { useState } from 'react';
import { useFilterStore } from '../../../store/ui/filter-store';
import { WIZARD_MODES, WizardModeId } from './wizard-config';
import { WizardStep } from './WizardStep';
import { WizardWelcome } from './WizardWelcome';

export const WizardApp: React.FC = () => {
    const [mode, setMode] = useState<WizardModeId>('backward');
    const [step, setStep] = useState(0); // 0: Welcome, 1+: Steps
    const [data, setData] = useState<Record<string, string>>({});
    const { setFilter } = useFilterStore();

    const handleNext = (stepData: Record<string, string>) => {
        setData(prev => ({ ...prev, ...stepData }));
        setStep(prev => prev + 1);
    };

    const handleFinish = (stepData: Record<string, string>) => {
        const finalData = { ...data, ...stepData };
        console.log("Wizard Completed", finalData);
        alert(`${WIZARD_MODES[mode].label}の目標が作成されました！（ダッシュボードへ移動します）`);

        // Reset and navigate
        setStep(0);
        setData({});
        // Navigate to dashboard (assuming target-dashboard exists as a view)
        setFilter('target-dashboard');
    };

    const handleBack = () => {
        setStep(prev => Math.max(0, prev - 1));
    };

    if (step === 0) {
        return (
            <WizardWelcome
                currentMode={mode}
                onModeChange={setMode}
                onStart={() => setStep(1)}
            />
        );
    }

    return (
        <WizardStep
            mode={mode}
            step={step}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinish}
        />
    );
};
