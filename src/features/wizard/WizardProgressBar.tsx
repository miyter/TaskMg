import React from 'react';
import { cn } from '../../../utils/cn';
import { WIZARD_MODES, WizardModeId } from './wizard-config';

interface WizardProgressBarProps {
    mode: WizardModeId;
    currentStep: number;
}

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({ mode, currentStep }) => {
    const config = WIZARD_MODES[mode];
    const totalSteps = config.steps.length;

    return (
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
            <div className="flex items-center space-x-1 mx-auto w-full justify-center">
                {config.steps.map((s, i) => {
                    const stepNum = i + 1;
                    const isCompleted = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;
                    const isFuture = currentStep < stepNum;

                    return (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center relative z-10 w-16">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold",
                                    isCurrent && "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900",
                                    isCompleted && "bg-green-500 text-white",
                                    isFuture && "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                )}>
                                    {isCompleted ? '✓' : stepNum}
                                </div>
                                <div className={cn(
                                    "text-[10px] mt-1 font-medium text-center w-20 truncate",
                                    isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                                )}>
                                    {s.title}
                                </div>
                            </div>

                            {i < totalSteps - 1 && (
                                <div className={cn(
                                    "h-1 flex-1 mx-[-10px] mt-[-14px] z-0 transition-all duration-500 rounded-full",
                                    currentStep > stepNum ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                                )} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
