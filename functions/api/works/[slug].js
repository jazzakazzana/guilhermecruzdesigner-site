import { json, noBackend, rowToWork } from '../../_lib/works.js';

export async function onRequestGet({ params, env }) {
  if (!env.DB) return noBackend();
  try {
    const r = await env.DB.prepare('SELECT * FROM works WHERE slug = ? AND published = 1').bind(String(params.slug)).first();
    if (!r) return json({ error: 'Não encontrado.' }, 404);
    return json(rowToWork(r), 200, { 'cache-control': 'public, max-age=60' });
  } catch (_) {
    return noBackend();
  }
}
