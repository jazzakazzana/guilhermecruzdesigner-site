// Verificação do JWT do Cloudflare Access (RS256).
// O Access já barra quem não está logado na borda; aqui o backend confere de novo,
// então mesmo que a regra do Access seja apagada sem querer, a API não abre.

let cache = { at: 0, team: '', keys: null };

function b64uToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const dec = new TextDecoder();
const parse = (s) => JSON.parse(dec.decode(b64uToBytes(s)));

export function teamHost(env) {
  return String(env.ACCESS_TEAM_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

async function getKeys(team, force) {
  if (!force && cache.keys && cache.team === team && Date.now() - cache.at < 600000) return cache.keys;
  const r = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('jwks');
  const { keys } = await r.json();
  cache = { at: Date.now(), team, keys };
  return keys;
}

export function resetAccessCache() { cache = { at: 0, team: '', keys: null }; }

export async function verifyAccessJwt(token, env, nowMs = Date.now()) {
  const team = teamHost(env);
  const aud = String(env.ACCESS_AUD || '').trim();
  if (!team || !aud) throw new Error('not-configured');

  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('format');
  const header = parse(parts[0]);
  if (header.alg !== 'RS256' || !header.kid) throw new Error('alg');

  let keys = await getKeys(team, false);
  let jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) { keys = await getKeys(team, true); jwk = keys.find((k) => k.kid === header.kid); }
  if (!jwk) throw new Error('kid');

  const key = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', key, b64uToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
  if (!ok) throw new Error('signature');

  const p = parse(parts[1]);
  const now = Math.floor(nowMs / 1000);
  if (typeof p.exp !== 'number' || p.exp < now) throw new Error('expired');
  if (typeof p.nbf === 'number' && p.nbf > now + 60) throw new Error('nbf');
  if (p.iss !== `https://${team}`) throw new Error('iss');
  const auds = Array.isArray(p.aud) ? p.aud : [p.aud];
  if (!auds.includes(aud)) throw new Error('aud');

  const admin = String(env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (admin && String(p.email || '').toLowerCase() !== admin) throw new Error('email');
  return p;
}
