# Site do Guilherme Cruz

Site estático (sem backend por enquanto) para publicar no Cloudflare.
Domínio: **guilhermecruzdesigner.com.br** · Instagram: **@guicruzdesign**

## O que tem em cada lugar

| Arquivo / pasta | Pra que serve |
|---|---|
| `public/index.html` | A página inteira (textos, estrutura) |
| `public/css/style.css` | Cores, fontes, layout |
| `public/js/main.js` | Só desenha os ícones de pixel das "conquistas" |
| `public/img/` | Fotos e peças (já otimizadas em WebP) e a imagem de compartilhamento `og.jpg` |
| `public/404.html` | Página de erro |
| `public/robots.txt`, `sitemap.xml` | Ajudam o Google a entender o site |
| `public/_headers` | Cabeçalhos básicos de segurança |
| `wrangler.jsonc` | Diz ao Cloudflare qual pasta publicar (`public`) |

Tudo que o visitante vê está dentro de `public/`. Pra trocar um texto, mexa no `index.html`. Pra trocar uma foto, substitua o arquivo em `public/img/` mantendo o mesmo nome.

## Publicar pela primeira vez

### 1. Domínio no Cloudflare
1. No Cloudflare, clique em **Add a domain** e informe `guilhermecruzdesigner.com.br`.
2. Escolha o plano gratuito. O Cloudflare mostra **dois servidores de DNS** (algo como `xxxx.ns.cloudflare.com`).
3. No Registro.br, abra o domínio, vá em **Alterar servidores DNS** e troque pelos dois do Cloudflare.
4. Espere o Cloudflare marcar o domínio como **Active** (pode levar de minutos a algumas horas).
5. Se o Registro.br tiver DNSSEC ativo, desative antes de trocar e reative depois seguindo as instruções do Cloudflare.

### 2. Código no GitHub
1. No GitHub, crie um repositório novo (sugestão: `guilhermecruzdesigner-site`).
2. Em **Add file → Upload files**, arraste **o conteúdo desta pasta** (`public`, `wrangler.jsonc`, `README.md`, `.gitignore`) e confirme com **Commit changes**.

### 3. Publicar no Cloudflare
1. No Cloudflare: **Workers & Pages → Create application** e escolha importar um repositório do GitHub.
2. Autorize o GitHub, selecione o repositório e a branch `main`.
3. Nome do projeto: `guilhermecruzdesigner` (o mesmo do `wrangler.jsonc`).
4. Deixe o comando de build em branco e o comando de deploy como `npx wrangler deploy`.
5. Clique em **Deploy**. Quando terminar, você ganha um endereço `*.workers.dev` pra testar.

(Os nomes dos botões podem variar um pouco, porque o painel do Cloudflare muda de vez em quando.)

### 4. Ligar o domínio ao site
1. Abra o projeto → **Settings → Domains & Routes → Add → Custom domain**.
2. Adicione `guilhermecruzdesigner.com.br` e também `www.guilhermecruzdesigner.com.br`.
3. O domínio só aparece como opção se já estiver ativo no Cloudflare (passo 1).

## Atualizações depois

Sempre que você (ou eu, na conversa) mudar um arquivo, é só substituí-lo no GitHub e fazer o commit. O Cloudflare publica a nova versão sozinho em poucos minutos.

## Antes de divulgar o link

- [ ] Trocar o aviso de "fotografando as peças" pelas fotos reais de papelaria, certificados e tags
- [ ] Conferir o site no celular e no computador
- [ ] Testar o link do WhatsApp, o e-mail e o Instagram
- [ ] Conferir a prévia do link: cole o endereço numa conversa do WhatsApp e veja se aparece a imagem

## Testar no seu computador (opcional)

Precisa do Node instalado. Na pasta do projeto: `npx wrangler dev`
