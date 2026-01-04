import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useWorkspace } from '../../hooks/useWorkspace';
import { addTarget } from '../../store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { toast } from '../../store/ui/toast-store';
import { useViewStore } from '../../store/ui/view-store';
import { getWizardModes, WizardModeId } from './wizard-config';
import { WizardStep } from './WizardStep';
import { WizardWelcome } from './WizardWelcome';

export const WizardApp: React.FC = () => {
    const [mode, setMode] = useState<WizardModeId>('backward');
    const [step, setStep] = useState(0); // 0: Welcome, 1+: Steps
    const [data, setData] = useState<Record<string, string>>({});
    const { setView, viewData } = useViewStore();
    const { workspaceId } = useWorkspace();
    const { t } = useTranslation();
    const { language } = useSettingsStore();
    const modesConfig = getWizardModes(language);

    useEffect(() => {
        if (viewData && (viewData as any).mode) {
            setMode((viewData as any).mode as WizardModeId);
            setStep(0);
        }
    }, [viewData]);

    const handleNext = (stepData: Record<string, string>) => {
        setData(prev => ({ ...prev, ...stepData }));
        setStep(prev => prev + 1);
    };



    const handleFinish = async (stepData: Record<string, string>) => {
        const finalData = { ...data, ...stepData };

        if (!workspaceId) {
            toast.error(t('wizard.alert_no_workspace'));
            return;
        }

        try {
            await addTarget(workspaceId, {
                mode: mode,
                data: finalData
            });

            toast.success(t('wizard.alert_create_success', { label: modesConfig[mode].label }));

            // Reset and navigate
            setStep(0);
            setData({});
            // Navigate to dashboard
            setView('target-dashboard');
        } catch (error) {
            console.error("Failed to save wizard target:", error);
            toast.error(t('wizard.alert_save_fail'));
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



