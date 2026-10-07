import { verifyAccessJwt } from '../../_lib/access.js';

const deny = (status, error) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function onRequest({ request, env, next, data }) {
  // Sem configuração do Access, a área admin fica FECHADA (nunca aberta).
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return deny(503, 'Área admin ainda não configurada (Cloudflare Access).');
  }
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return deny(401, 'Não autenticado.');
  let payload;
  try {
    payload = await verifyAccessJwt(token, env);
  } catch (_) {
    return deny(403, 'Acesso negado.');
  }
  data.email = payload.email || '';

  // Proteção contra CSRF: escrita só com cabeçalho custom (navegador não envia de outro site sem CORS).
  if (!['GET', 'HEAD'].includes(request.method)) {
    if (request.headers.get('X-Requested-With') !== 'admin-ui') return deny(403, 'Requisição inválida.');
    const origin = request.headers.get('Origin');
    if (origin && new URL(origin).host !== new URL(request.url).host) return deny(403, 'Origem inválida.');
  }
  return next();
}
