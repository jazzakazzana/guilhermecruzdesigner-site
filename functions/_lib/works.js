// Utilidades compartilhadas pelas rotas de trabalhos (portfólio).

export const CATEGORIES = {
  papelaria: 'Papelaria e impressos',
  identidade: 'Identidade visual',
  campanhas: 'Conteúdo e campanhas',
};

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

export function noBackend() {
  return json({ error: 'Backend ainda não configurado (banco D1 não ligado ao projeto).' }, 503);
}

export function slugify(s) {
  return (
    String(s)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'projeto'
  );
}

export function rowToWork(r) {
  let images = [];
  try {
    const parsed = JSON.parse(r.images || '[]');
    if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === 'string');
  } catch (_) {}
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    client: r.client || '',
    category: r.category,
    categoryLabel: CATEGORIES[r.category] || r.category,
    description: r.description || '',
    tags: (r.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    year: r.year || null,
    cover: r.cover || images[0] || '',
    images,
    featured: !!r.featured,
    published: !!r.published,
  };
}

// Só aceita imagens que vêm do próprio site: /media/works/... (R2) ou /img/... (estáticas).
const IMG_RE = /^\/(media\/works|img)\/[A-Za-z0-9][A-Za-z0-9._-]*$/;
export function validImageUrl(u) {
  return typeof u === 'string' && u.length <= 200 && IMG_RE.test(u) && !u.includes('..');
}

export function parseInput(b) {
  if (!b || typeof b !== 'object') return { error: 'Corpo inválido.' };
  const title = String(b.title ?? '').trim();
  if (!title || title.length > 120) return { error: 'Título é obrigatório (até 120 caracteres).' };
  const client = String(b.client ?? '').trim();
  if (client.length > 120) return { error: 'Cliente: até 120 caracteres.' };
  const category = String(b.category ?? '');
  if (!CATEGORIES[category]) return { error: 'Categoria inválida.' };
  const description = String(b.description ?? '').trim();
  if (description.length > 4000) return { error: 'Descrição: até 4000 caracteres.' };

  let tags = b.tags;
  if (typeof tags === 'string') tags = tags.split(',');
  if (!Array.isArray(tags)) tags = [];
  tags = tags.map((t) => String(t).replace(/,/g, ' ').trim()).filter(Boolean);
  if (tags.length > 8 || tags.some((t) => t.length > 30)) return { error: 'Tags: no máximo 8, de até 30 caracteres.' };

  let year = null;
  if (b.year !== null && b.year !== undefined && b.year !== '') {
    year = Number(b.year);
    if (!Number.isInteger(year) || year < 1990 || year > 2100) return { error: 'Ano inválido.' };
  }

  const images = Array.isArray(b.images) ? b.images : [];
  if (images.length > 12) return { error: 'No máximo 12 imagens por trabalho.' };
  if (!images.every(validImageUrl)) return { error: 'Imagem inválida.' };

  return {
    value: {
      title, client, category, description,
      tags: tags.join(','),
      year,
      images,
      cover: images[0] || '',
      published: b.published ? 1 : 0,
      featured: b.featured ? 1 : 0,
    },
  };
}

// Remove do R2 as imagens que o trabalho deixou de usar.
export async function deleteMedia(env, urls) {
  if (!env.MEDIA) return;
  for (const u of urls) {
    if (typeof u === 'string' && u.startsWith('/media/')) {
      try { await env.MEDIA.delete(u.slice('/media/'.length)); } catch (_) {}
    }
  }
}
