import React, { useEffect, useState } from 'react';
import { addTarget } from '../../store';
import { useViewStore } from '../../store/ui/view-store';
import { WIZARD_MODES, WizardModeId } from './wizard-config';
import { WizardStep } from './WizardStep';
import { WizardWelcome } from './WizardWelcome';

export const WizardApp: React.FC = () => {
    const [mode, setMode] = useState<WizardModeId>('backward');
    const [step, setStep] = useState(0); // 0: Welcome, 1+: Steps
    const [data, setData] = useState<Record<string, string>>({});
    const { setView, viewData } = useViewStore();

    useEffect(() => {
        if (viewData?.mode) {
            setMode(viewData.mode as WizardModeId);
            setStep(0);
        }
    }, [viewData]);

    const handleNext = (stepData: Record<string, string>) => {
        setData(prev => ({ ...prev, ...stepData }));
        setStep(prev => prev + 1);
    };



    const handleFinish = async (stepData: Record<string, string>) => {
        const finalData = { ...data, ...stepData };

        try {
            await addTarget({
                mode: mode,
                data: finalData
            });
            console.log("Wizard Completed, Saved to Firestore", finalData);
            alert(`${WIZARD_MODES[mode].label}の目標が作成されました！（ダッシュボードへ移動します）`);

            // Reset and navigate
            setStep(0);
            setData({});
            // Navigate to dashboard
            setView('target-dashboard');
        } catch (error) {
            console.error("Failed to save wizard target:", error);
            alert("目標の保存に失敗しました。");
        }
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
