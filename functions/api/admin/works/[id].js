import { json, noBackend, rowToWork, parseInput, deleteMedia } from '../../../_lib/works.js';

const idOf = (p) => {
  const n = Number(p.id);
  return Number.isInteger(n) && n > 0 ? n : null;
};
const imagesOf = (row) => { try { return JSON.parse(row.images || '[]'); } catch (_) { return []; } };

export async function onRequestPut({ request, env, params }) {
  if (!env.DB) return noBackend();
  const id = idOf(params);
  if (!id) return json({ error: 'ID inválido.' }, 400);
  const old = await env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(id).first();
  if (!old) return json({ error: 'Não encontrado.' }, 404);
  let body;
  try { body = await request.json(); } catch (_) { return json({ error: 'JSON inválido.' }, 400); }
  const { value: v, error } = parseInput(body);
  if (error) return json({ error }, 400);

  await env.DB.prepare(
    `UPDATE works SET title=?, client=?, category=?, description=?, tags=?, year=?, cover=?, images=?, published=?, featured=? WHERE id=?`
  ).bind(v.title, v.client, v.category, v.description, v.tags, v.year, v.cover,
         JSON.stringify(v.images), v.published, v.featured, id).run();

  const dropped = imagesOf(old).filter((u) => !v.images.includes(u));
  await deleteMedia(env, dropped);
  const row = await env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(id).first();
  return json(rowToWork(row));
}

export async function onRequestDelete({ env, params }) {
  if (!env.DB) return noBackend();
  const id = idOf(params);
  if (!id) return json({ error: 'ID inválido.' }, 400);
  const old = await env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(id).first();
  if (!old) return json({ error: 'Não encontrado.' }, 404);
  await env.DB.prepare('DELETE FROM works WHERE id = ?').bind(id).run();
  await deleteMedia(env, imagesOf(old));
  return json({ ok: true });
}
