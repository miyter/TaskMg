// Cloudflare Workersで静的アセットを扱うためのボイラープレートコードだよ
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    // Pagesと同様に、静的アセットを公開するためのルーティング処理を呼び出す
    return await getAssetFromKV(event);
  } catch (e) {
    // アセットが見つからない場合は、index.htmlを返す（SPAに必要な設定）
    if (e.status === 404) {
      try {
        return await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        });
      } catch (e) {
        return new Response(e.message || e.toString(), { status: 500 });
      }
    }
    return new Response(e.message || e.toString(), { status: e.status || 500 });
  }
}