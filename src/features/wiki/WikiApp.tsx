import { useTranslation } from '../../core/translations';
import { useModalStore } from '../../store/ui/modal-store'; // Update import path if necessary
import { WIKI_DATA } from './wiki-data';
import { WikiFrameworkCard } from './WikiFrameworkCard';

export const WikiApp: React.FC = () => {
    const { openModal } = useModalStore();
    const { t } = useTranslation();

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                        {t('sidebar.framework_wiki')}
                    </span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {WIKI_DATA.map(framework => (
                        <WikiFrameworkCard
                            key={framework.id}
                            framework={framework}
                            onClick={(fw) => openModal('wiki-framework', fw)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};



