import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler';

const ASSET_HANDLER_OPTIONS = {
  mapRequestToAsset: (request) => {
    const url = new URL(request.url);
    
    // ルートパスや拡張子のないパスへのアクセスは index.html を返す（SPA対応）
    if (url.pathname.endsWith('/') || !url.pathname.includes('.')) {
      url.pathname = '/index.html';
    }
    
    return new Request(url.toString(), request);
  },
};

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, ASSET_HANDLER_OPTIONS);
  } catch (e) {
    // ★修正: ファイルが見つからない場合は 404 を返す
    if (e instanceof NotFoundError) {
      return new Response('Not Found', { status: 404 });
    }
    // その他のエラーは 500 を返す
    return new Response(e.message || e.toString(), { status: 500 });
  }
}