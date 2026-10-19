Site do Guilherme Cruz: regras para o Claude Code
O site guilhermecruzdesigner.com.br está pronto e aprovado pelo Gui (versão de 13/10/2026). Ele está feliz com o resultado. A regra número 1 deste arquivo é: não mude nada que o Gui não pediu.
Quem é o Gui
Guilherme Cruz, designer gráfico e arte-finalista em São Leopoldo (RS). Não programa. Eu escrevo todo o código e explico em português do Brasil, em linguagem simples, um passo de cada vez.
Regras de ouro
Só faça o que foi pedido. Nada de "aproveitei e melhorei". Sem reorganizar, renomear, limpar, atualizar ou refatorar o que não foi pedido.
Se o pedido for vago ("melhora o site", "deixa mais bonito"), pergunte o que exatamente antes de mexer em qualquer arquivo.
Pergunta não é pedido. Se o Gui só perguntar ("como funciona X?"), responda sem editar nada.
Antes de editar, diga em uma ou duas frases o que vai mudar e em quais arquivos. Mudanças pequenas e pontuais. Uma coisa por vez.
Não mude cores, fontes, textos, fotos nem layout se isso não foi pedido. A identidade visual está fechada (veja abaixo).
Nunca instale dependências, ferramentas de build ou frameworks (React, Vite, Tailwind etc.) sem o Gui aprovar. O site é HTML, CSS e JavaScript simples, e deve continuar assim.
Nunca faça commit ou push sem o Gui pedir. Nunca mexa na branch `main`: trabalhe na branch `rascunho`. Quem leva para o site de verdade é o Gui, aprovando no GitHub.
Nunca apague arquivos sem avisar e sem ok.
Se algo der errado ou você não tiver certeza, pare e pergunte. Não tente "consertar" por conta própria.
Arquivos protegidos (não editar sem o Gui pedir de forma explícita)
`wrangler.jsonc`: configuração do Cloudflare (banco, imagens, login do painel). Se for sobrescrito por uma versão errada, o painel /admin quebra. Nunca troque por versões antigas.
`functions/` e `db/`: backend (API, painel de administração, upload).
`public/_headers`: cabeçalhos de segurança.
`public/admin/` e `public/js/admin.js`: painel de administração.
Se um pedido exigir mexer nesses arquivos, avise primeiro o que muda e o risco.
Como o projeto funciona
Hospedado no Cloudflare Pages, ligado a este repositório do GitHub. Pasta publicada: `public`. Não há etapa de build.
Cada vez que a branch `main` recebe uma mudança, o site de verdade é atualizado sozinho. Por isso `main` é intocável.
Branches que não são a `main` ganham um endereço de prévia no Cloudflare, onde o Gui confere antes de aprovar.
Páginas: `/` (home), `/como-funciona/`, `/briefing/` ("Pedir orçamento"), `/privacidade/`, `/sobre-mim/` (só no rodapé), `/portfolio/`, `/projeto/` (detalhe de trabalho), `/admin/` (painel, protegido por login do Cloudflare Access).
Home: `public/index.html`. Estilos: `public/css/style.css` (base) e `public/css/anim.css` (animações). Scripts: `public/js/main.js` (ícones de pixel das conquistas), `public/js/portfolio.js` (trabalhos), `public/js/anim.js` (animações), `public/js/admin.js` (painel).
As animações usam o atributo `data-reveal` nos elementos do HTML e respeitam "reduzir movimento". Se o `anim.js` falhar, o site aparece normal.
Os trabalhos do portfólio vêm do banco D1 (`/api/works`) e, se falhar, de `public/data/works.json`. O Gui cadastra novos trabalhos pelo `/admin/`, não pelo código.
Identidade visual (fechada)
Cores (paleta da designer, desde 18/10/2026): Deep Forest `#102716`, Swamp Green `#4A644D`, Orange `#DE6D20`, Black `#111111`, Dark Grey `#515151`, Smoke Grey `#E5E5E5`, White `#FFFFFF`. O `/admin/` ainda usa as cores antigas via `style.css`.
Fontes: Plus Jakarta Sans (títulos, 700/800) e Inter (textos). Não adicionar outras. Títulos em minúsculas com inicial maiúscula (sem caixa alta).
Estilo: limpo, bordas de 3px, sombras sólidas deslocadas, sem fundos decorativos (nada de quadrados de mangá), animação discreta. Botão principal laranja com texto branco. Mudanças de visual do site público vão em `public/css/site.css`.
Nunca usar personagens, logos ou obras de terceiros (anime, jogos) nas peças visuais. Linguagem visual original.
Ao terminar qualquer tarefa
Rode o site localmente (`python3 -m http.server` dentro de `public`) e confira se a página mexida abre sem erro.
Diga em poucas palavras o que mudou e quais arquivos foram tocados. Nada além disso.
Lembre o Gui: se a mudança de CSS ou JS não aparecer no site, é cache do navegador (Ctrl+F5 ou janela anônima).
Em caso de arrependimento
O Gui pode voltar a qualquer momento para a versão aprovada: ela está marcada no GitHub como `versao-aprovada-2026-10-13`. Se o Gui disser "desfaz", ajude a voltar para ela sem inventar nada novo.
