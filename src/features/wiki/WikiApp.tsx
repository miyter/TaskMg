import { IconWiki } from '../../components/common/Icons';
import { useTranslation } from '../../core/translations';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { getWikiData } from './wiki-data';
import { WikiFrameworkCard } from './WikiFrameworkCard';

export const WikiApp: React.FC = () => {
    const { openModal } = useModalStore();
    const { t } = useTranslation();
    const { language } = useSettingsStore();

    const frameworks = getWikiData(language);

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                        <IconWiki className="w-8 h-8 text-blue-500" />
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                        {t('sidebar.framework_wiki')}
                    </span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {frameworks.map(framework => (
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



