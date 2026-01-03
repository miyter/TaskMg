import React, { useState } from 'react';
import { IconCheck, IconChevronRight } from '../../components/common/Icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useTranslation } from '../../core/translations';
import { WIZARD_MODES, WizardModeId } from './wizard-config';
import { WizardProgressBar } from './WizardProgressBar';

interface WizardStepProps {
    mode: WizardModeId;
    step: number;
    onBack: () => void;
    onNext: (data: Record<string, string>) => void;
    onFinish: (data: Record<string, string>) => void;
}

export const WizardStep: React.FC<WizardStepProps> = ({ mode, step, onBack, onNext, onFinish }) => {
    const { t } = useTranslation();
    const config = WIZARD_MODES[mode];
    const stepIndex = step - 1;
    const stepConfig = config.steps[stepIndex];
    const totalSteps = config.steps.length;

    // Local state for inputs in this step
    const [inputs, setInputs] = useState<Record<number, string>>({});

    const handleChange = (index: number, value: string) => {
        setInputs(prev => ({ ...prev, [index]: value }));
    };

    const handleNext = () => {
        // Collect data using the keys defined in the config
        const stepData = stepConfig.inputs.reduce((acc, input, idx) => {
            const value = inputs[idx] || '';
            // Use meaningful key from config
            if (input.key) {
                acc[input.key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        if (step < totalSteps) {
            onNext(stepData);
        } else {
            onFinish(stepData);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{config.label} Mode</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 min-h-[500px] flex flex-col">
                <WizardProgressBar mode={mode} currentStep={step} />

                <div className="flex-1 animate-fade-in">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Q{step}. {stepConfig.title}</h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">{stepConfig.description}</p>

                    <div className="mb-8 space-y-4">
                        {stepConfig.inputs.map((input, idx) => (
                            <div key={input.key || idx}>
                                {input.type === 'textarea' ? (
                                    <Textarea
                                        className="text-base"
                                        rows={5}
                                        placeholder={input.placeholder}
                                        value={inputs[idx] || ''}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        className="text-base"
                                        placeholder={input.placeholder}
                                        value={inputs[idx] || ''}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="text-gray-600 dark:text-gray-400 font-medium"
                    >
                        {t('wizard.back')}
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            className="bg-blue-600 hover:bg-blue-700 shadow-md"
                            rightIcon={<IconChevronRight className="w-4 h-4 ml-2" />}
                        >
                            {t('wizard.next')}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 shadow-lg transform hover:scale-105"
                            leftIcon={<IconCheck className="w-5 h-5 mr-2" />}
                        >
                            {t('wizard.finish')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};



