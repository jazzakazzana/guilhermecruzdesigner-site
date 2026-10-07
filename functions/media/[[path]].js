const KEY_RE = /^works\/[a-f0-9-]{36}\.(webp|jpg|png)$/;

export async function onRequestGet({ params, env }) {
  if (!env.MEDIA) return new Response('Not found', { status: 404 });
  const key = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!KEY_RE.test(key)) return new Response('Not found', { status: 404 });
  const obj = await env.MEDIA.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body, {
    headers: {
      'content-type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
      etag: obj.httpEtag,
    },
  });
}
