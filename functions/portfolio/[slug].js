// /portfolio/<slug> mostra a página de projeto (public/projeto/index.html).
// Se o banco estiver ligado, coloca título e imagem de compartilhamento certos no HTML.

async function fetchAsset(env, url, path) {
  let target = new URL(path, url);
  for (let i = 0; i < 4; i++) {
    const res = await env.ASSETS.fetch(new Request(target.toString()));
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      target = new URL(res.headers.get('location'), target);
      continue;
    }
    return res;
  }
  return new Response('Not found', { status: 404 });
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const page = await fetchAsset(env, url, '/projeto/');
  if (!page.ok) return page;

  let work = null;
  if (env.DB) {
    try {
      work = await env.DB.prepare('SELECT title, client, description, cover FROM works WHERE slug = ? AND published = 1')
        .bind(String(params.slug)).first();
    } catch (_) {}
  }
  const headers = new Headers(page.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');
  headers.set('cache-control', 'public, max-age=60');
  if (!work) return new Response(page.body, { status: 200, headers });

  const title = `${work.title}${work.client ? ' — ' + work.client : ''} · Guilherme Cruz`;
  const desc = (work.description || 'Projeto do portfólio de Guilherme Cruz, designer gráfico.').slice(0, 200);
  const img = work.cover ? new URL(work.cover, url).toString() : '';
  const set = (attr, val) => ({ element(e) { e.setAttribute(attr, val); } });
  const rw = new HTMLRewriter()
    .on('title', { element(e) { e.setInnerContent(title); } })
    .on('meta[name="description"]', set('content', desc))
    .on('meta[property="og:title"]', set('content', title))
    .on('meta[property="og:description"]', set('content', desc))
    .on('meta[property="og:url"]', set('content', url.origin + url.pathname))
    .on('link[rel="canonical"]', set('href', url.origin + url.pathname));
  if (img) rw.on('meta[property="og:image"]', set('content', img));
  return rw.transform(new Response(page.body, { status: 200, headers }));
}
