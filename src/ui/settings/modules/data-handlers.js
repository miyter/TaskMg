import { createBackupData, importBackupData } from '../../../store/store.js';
import { showMessageModal } from '../../components.js';

export function setupExportHandler() {
    const btn = document.getElementById('export-data-btn-new');
    if (!btn) return;

    btn.onclick = async () => {
        const label = btn.querySelector('span.font-bold');
        const originalText = label ? label.textContent : 'バックアップを作成';

        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-wait');
        if (label) label.textContent = "バックアップ作成中...";

        try {
            const data = await createBackupData();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${timestamp}.json`;
            a.click();
            URL.revokeObjectURL(url);

            showMessageModal({ message: "バックアップをダウンロードしたぞ", type: 'success' });
        } catch (e) {
            console.error(e);
            showMessageModal({ message: "エクスポートに失敗した", type: 'error' });
        } finally {
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-wait');
            if (label) label.textContent = originalText;
        }
    };
}

export function setupImportHandler() {
    const btn = document.getElementById('import-data-btn-new');
    const input = document.getElementById('import-file-input');
    if (!btn || !input) return;

    btn.onclick = () => {
        input.value = '';
        input.click();
    };

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const json = JSON.parse(evt.target.result);
                if (!json.tasks || !json.projects) throw new Error("Invalid backup format");

                btn.disabled = true;
                btn.classList.add('opacity-70', 'cursor-wait');

                const result = await importBackupData(json);

                showMessageModal({
                    message: `インポート完了！\nタスク: ${result.tasksCount}件\nプロジェクト: ${result.projectsCount}件\nラベル: ${result.labelsCount}件`,
                    type: 'success'
                });

                setTimeout(() => window.location.reload(), 1500);

            } catch (err) {
                console.error(err);
                showMessageModal({ message: "インポートに失敗しました。\nファイルが破損している可能性があります。", type: 'error' });
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-wait');
            }
        };
        reader.readAsText(file);
    };
}
