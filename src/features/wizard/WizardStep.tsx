import React, { useState } from 'react';
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
        // Collect data with keys like 'step1-input0', or just pass the array for this step.
        // For simplicity, let's pass a structured object keyed by step and input index?
        // Or just flattened. The legacy code didn't strictly save data structurally, just moved steps.
        // We'll pass current step inputs up.
        // Actually, we might want to preserve values if user goes back.
        // For now, simple implementation:
        const stepData = Object.entries(inputs).reduce((acc, [k, v]) => {
            acc[`step${step}_input${k}`] = v;
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
                            <div key={idx}>
                                {input.type === 'textarea' ? (
                                    <textarea
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-base"
                                        rows={5}
                                        placeholder={input.placeholder}
                                        value={inputs[idx] || ''}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-base"
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
                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                    >
                        戻る
                    </button>

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition font-medium flex items-center"
                        >
                            次へ
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition font-medium flex items-center transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            完了して作成
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
