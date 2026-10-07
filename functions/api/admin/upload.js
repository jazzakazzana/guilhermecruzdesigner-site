import { json } from '../../_lib/works.js';

const MAX = 8 * 1024 * 1024;

function sniff(b) {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ['jpg', 'image/jpeg'];
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ['png', 'image/png'];
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return ['webp', 'image/webp'];
  return null;
}

export async function onRequestPost({ request, env }) {
  if (!env.MEDIA) return json({ error: 'Armazenamento de imagens (R2) ainda não configurado.' }, 503);
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX) return json({ error: 'Imagem grande demais (máx. 8 MB).' }, 413);
  const buf = new Uint8Array(await request.arrayBuffer());
  if (buf.length === 0 || buf.length > MAX) return json({ error: 'Arquivo vazio ou grande demais.' }, 413);
  const kind = sniff(buf);
  if (!kind) return json({ error: 'Formato não suportado. Use JPG, PNG ou WebP.' }, 415);
  const key = `works/${crypto.randomUUID()}.${kind[0]}`;
  await env.MEDIA.put(key, buf, { httpMetadata: { contentType: kind[1] } });
  return json({ url: `/media/${key}` }, 201);
}
