import { json, noBackend, rowToWork, CATEGORIES } from '../../_lib/works.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return noBackend();
  const url = new URL(request.url);
  const cat = url.searchParams.get('category');
  const featured = url.searchParams.get('featured') === '1';
  let sql = 'SELECT * FROM works WHERE published = 1';
  const args = [];
  if (cat && CATEGORIES[cat]) { sql += ' AND category = ?'; args.push(cat); }
  if (featured) sql += ' AND featured = 1';
  sql += ' ORDER BY position ASC, id DESC';
  try {
    const { results } = await env.DB.prepare(sql).bind(...args).all();
    return json(results.map(rowToWork), 200, { 'cache-control': 'public, max-age=60' });
  } catch (_) {
    return noBackend();
  }
}
