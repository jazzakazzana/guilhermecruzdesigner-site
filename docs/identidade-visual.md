# Identidade visual existente

Registro das decisões presentes no AGENTS.md e no CLAUDE.md, conferidas com os arquivos do projeto em 09/11/2026. Preservar o visual aprovado até o Gui solicitar e aprovar mudanças.

## Paleta aprovada

Paleta registrada desde 18/10/2026:

| Cor | Código |
| --- | --- |
| Deep Forest | `#102716` |
| Swamp Green | `#4A644D` |
| Orange | `#DE6D20` |
| Black | `#111111` |
| Dark Grey | `#515151` |
| Smoke Grey | `#E5E5E5` |
| White | `#FFFFFF` |

## Tipografia

Desde 05/11/2026, usar Dela Gothic One nos títulos, com seu peso único, e DM Sans nos textos, nos pesos 400 a 700. Não adicionar fontes sem autorização. Títulos em minúsculas com inicial maiúscula, sem caixa alta.

## Linguagem visual

O estilo aprovado é limpo, com bordas de 3 px, sombras sólidas deslocadas e animações discretas. Não adicionar fundos decorativos ou quadrados de mangá. O botão principal usa laranja com texto branco.

Essas orientações não autorizam normalizar os componentes existentes: o código possui variações pontuais de bordas e tamanhos. Preservar cada implementação até um pedido específico.

Não alterar cores, tipografia, logotipo, fotos, componentes ou estrutura por preferência estética do assistente. A linguagem visual deve ser original; manter a proibição de usar personagens, logos ou obras de terceiros nas peças visuais.

## Organização no código

As páginas públicas carregam `public/css/style.css` como base e `public/css/site.css` depois, aplicando a identidade atual. Mudanças visuais públicas solicitadas devem ir em `site.css`, conforme as regras existentes.

O painel `/admin/` usa o CSS base e mantém as fontes e cores antigas. Não estender automaticamente a identidade pública ao painel. Uma alteração em `style.css` pode afetar os dois ambientes.

`public/css/anim.css` e `public/js/anim.js` controlam as animações com `data-reveal`. Preservar o respeito à preferência de movimento reduzido e a alternativa que mantém o conteúdo visível quando a animação falha.

O arquivo `sistema-visual-guicruz.html`, na raiz, serve como referência visual e fica fora da pasta publicada. Sua existência não autoriza aplicar diferenças ao site.
