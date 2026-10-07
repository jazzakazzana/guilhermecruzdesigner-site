# Site do Guilherme Cruz (Cloudflare Pages)

Site estático + Pages Functions (backend), hospedado no Cloudflare Pages com deploy automático pelo GitHub.

## Páginas
- `/` início (introdução + convites pra ler mais)
- `/sobre-mim/` história completa
- `/portfolio/` lista com filtros, `/portfolio/<nome-do-projeto>` página de cada trabalho
- `/admin/` painel pra cadastrar trabalhos (protegido por login do Cloudflare Access)

## Como o painel funciona
Trabalhos ficam num banco **D1**, imagens num bucket **R2**. O painel reduz e converte as imagens pra WebP no navegador antes de enviar.
Enquanto o backend não estiver configurado, o portfólio mostra os 4 trabalhos de `public/data/works.json` e o `/admin` fica fechado (nunca aberto).

## Configurar o backend (uma vez só)
1. **Banco D1**: Cloudflare → Armazenamento e bancos de dados → D1 → Criar banco `gc-portfolio` → aba **Console** → cole o conteúdo de `db/schema.sql` → Executar. Copie o **ID do banco**.
2. **Bucket R2**: R2 → Criar bucket `gc-media` (o R2 pode pedir um cartão cadastrado; o plano gratuito cobre bastante).
3. **Access**: Zero Trust → Access → Aplicativos → Adicionar → Self-hosted. Domínio `guilhermecruzdesigner.com.br`, dois caminhos: `admin*` e `api/admin*`. Política **Allow** só pro seu e-mail. Depois de salvar, copie o **Application Audience (AUD) Tag**. O "team domain" aparece em Zero Trust → Configurações (algo como `seutime.cloudflareaccess.com`).
4. No GitHub, abra `wrangler.backend.exemplo.jsonc`, copie o conteúdo, cole em `wrangler.jsonc` e preencha o ID do banco, o team domain e o AUD. Commit. O deploy roda sozinho.
5. Acesse `guilhermecruzdesigner.com.br/admin/`, faça login e cadastre os trabalhos.

Obs.: o Access só protege no domínio próprio (não no `.pages.dev`); lá a API do admin responde 401 mesmo assim.

## Segurança
- A API do admin confere o token do Access (assinatura RS256, validade, emissor, AUD e e-mail) e fecha se faltar configuração.
- Escritas exigem o cabeçalho `X-Requested-With: admin-ui` (anti-CSRF).
- Upload valida o tipo real do arquivo (JPG/PNG/WebP, até 8 MB); só caminhos de imagem do próprio site são aceitos.

## Estrutura
`public/` site · `functions/` backend · `db/schema.sql` banco · `wrangler.jsonc` config do Pages (sem build command; diretório de saída `public`).
