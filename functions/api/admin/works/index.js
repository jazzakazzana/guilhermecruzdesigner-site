import { json, noBackend, rowToWork, parseInput, slugify } from '../../../_lib/works.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return noBackend();
  const { results } = await env.DB.prepare('SELECT * FROM works ORDER BY position ASC, id DESC').all();
  return json(results.map(rowToWork));
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return noBackend();
  let body;
  try { body = await request.json(); } catch (_) { return json({ error: 'JSON inválido.' }, 400); }
  const { value: v, error } = parseInput(body);
  if (error) return json({ error }, 400);

  const base = slugify(v.title);
  let slug = base;
  for (let i = 2; i < 100; i++) {
    const hit = await env.DB.prepare('SELECT 1 FROM works WHERE slug = ?').bind(slug).first();
    if (!hit) break;
    slug = `${base}-${i}`;
  }
  const res = await env.DB.prepare(
    `INSERT INTO works (slug,title,client,category,description,tags,year,cover,images,published,featured,position)
     VALUES (?,?,?,?,?,?,?,?,?,?,?, COALESCE((SELECT MIN(position) FROM works),0) - 1)`
  ).bind(slug, v.title, v.client, v.category, v.description, v.tags, v.year, v.cover,
         JSON.stringify(v.images), v.published, v.featured).run();
  const row = await env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(res.meta.last_row_id).first();
  return json(rowToWork(row), 201);
}
