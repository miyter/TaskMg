import { getAssetFromKV, NotFoundError, serveSinglePageApp } from '@cloudflare/kv-asset-handler';

const ASSET_HANDLER_OPTIONS = {
  mapRequestToAsset: serveSinglePageApp,
};

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, ASSET_HANDLER_OPTIONS);
  } catch (e) {
    if (e instanceof NotFoundError) {
      // Return a proper HTML 404 page instead of plain text
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>404 Not Found</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 50px 20px; color: #333; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            p { margin-bottom: 30px; color: #666; }
            a { color: #2563EB; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
            <h1>Page Not Found</h1>
            <p>The requested resource could not be found.</p>
            <a href="/">Return to Home</a>
        </body>
        </html>`,
        { status: 404, headers: { 'content-type': 'text/html' } }
      );
    }

    // Internal Server Error
    return new Response(e.message || e.toString(), { status: 500 });
  }
}