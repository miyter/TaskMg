// Cloudflare Workersで静的アセットを扱うためのボイラープレートコードだよ
// @cloudflare/kv-asset-handler のインポートはそのまま
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// SPA（シングルページアプリケーション）モードを有効にするための変数だよ
const ASSET_HANDLER_OPTIONS = {
  // 存在しないパスへのリクエストは、すべてindex.htmlにリダイレクトしてね
  mapRequestToAsset: (request) => {
    // URLのパスを取得
    const url = new URL(request.url);
    
    // パスがルート('/')でない、またはファイル拡張子がない場合は
    // index.htmlを返すようにマップする
    if (url.pathname.endsWith('/') || !url.pathname.includes('.')) {
      url.pathname = '/index.html';
    }
    
    // KV-Asset-Handlerが正しいアセットを見つけられるようにURLを返す
    return new Request(url.toString(), request);
  },
};


addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    // サイトのアセット（ファイル）をKVから取得して返す
    return await getAssetFromKV(event, ASSET_HANDLER_OPTIONS);
  } catch (e) {
    // 予期せぬエラーが発生したら500エラーを返す
    return new Response(e.message || e.toString(), { status: 500 });
  }
}