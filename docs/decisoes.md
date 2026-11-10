# Decisões e pendências

Registro inicial em 09/11/2026. Este documento distingue orientações aprovadas de alterações autorizadas. Não substitui as regras do [AGENTS.md](../AGENTS.md).

## Decisões já aprovadas

| Decisão | Origem |
| --- | --- |
| Preservar o site aprovado e alterar somente o solicitado | AGENTS.md e CLAUDE.md existentes |
| Manter paleta, tipografia e linguagem visual atuais | Instruções existentes; detalhes em identidade-visual.md |
| Priorizar identidade visual, papelaria, impressos e aplicações físicas; manter social media como oferta complementar | Contexto fornecido pelo Gui em 09/11/2026 |
| Adotar o posicionamento, a bio e os arquétipos Criador + Sábio como referências da marca | Contexto fornecido pelo Gui; detalhes em marca.md |
| Orientar a comunicação ao empreendedor, conforme a estratégia da Letícia | Contexto fornecido pelo Gui; detalhes em comunicacao.md |
| Contextualizar os projetos e identificar trabalhos conceituais, sem inventar dados | Contexto fornecido pelo Gui |
| Preservar a autonomia de design do Gui e avaliar consequências técnicas com franqueza | Contexto fornecido pelo Gui |
| Manter as funcionalidades, avaliar impactos e priorizar consistência, acessibilidade, responsividade, desempenho e manutenção dentro do escopo solicitado | Contexto fornecido pelo Gui |
| Trabalhar na rascunho; não fazer commit, push, merge ou deploy sem autorização explícita para a operação | Instruções existentes e contexto fornecido pelo Gui |
| Criar os quatro documentos em docs/ e complementar o AGENTS.md sem substituir seu conteúdo | Pedido explícito do Gui nesta conversa, em 09/11/2026 |

A autorização desta etapa cobre somente a documentação. Não inclui alterações no site, no CLAUDE.md, na configuração do Claude Code ou nos serviços externos.

## Aspectos ainda pendentes

| Tema | O que falta decidir ou fornecer |
| --- | --- |
| Bio e chamada da home | Se a bio será aplicada ao site e em qual local; preservar a chamada atual até um pedido específico |
| Projetos contextualizados | Quais trabalhos revisar e quais informações reais usar sobre necessidades e escolhas |
| Formato dos detalhes | Se basta a descrição atual ou se novos campos serão necessários |
| Projetos conceituais | Quais trabalhos são conceituais e como identificá-los na interface |
| Serviços | Qualquer mudança de destaque, oferta ou texto, incluindo a presença atual de landing pages |
| Visual e funcionalidades | Escopo e aprovação de cada alteração futura |
| Claude Code | Eventual referência no CLAUDE.md aos mesmos documentos; nenhuma edição autorizada nesta etapa |

## Cuidados identificados na análise

O README contém orientações de instalação inicial que incluem substituir `wrangler.jsonc` pelo exemplo. O arquivo atual já possui valores configurados; não repetir esse procedimento como rotina de desenvolvimento.

A variável `ADMIN_EMAIL` não aparece no `wrangler.jsonc` local. O código usa essa restrição adicional quando ela existe; não foi verificado se o Cloudflare a define externamente. Não concluir que a política de acesso está incorreta sem verificar o ambiente.

O formulário de impressos contém `required` na primeira opção de material, o que pode obrigar a seleção de cartão de visita. Esse ponto requer validação específica; sua identificação não autoriza corrigir o formulário nesta etapa.

O fallback `public/data/works.json` é independente dos cadastros do painel. Se a API falhar, os quatro exemplos locais podem diferir do portfólio atual.

A tag `versao-aprovada-2026-10-13` guarda uma versão do código; ela não recupera trabalhos do D1 ou imagens do R2. Uma restauração precisa considerar os dados separadamente, sem sobrescrever a configuração atual por uma antiga.

## Limites da verificação

A análise conferiu arquivos e referências locais do Git. Não validou o banco, as imagens remotas, a política do Access, as proteções no GitHub ou a configuração efetiva de publicação e prévias no Cloudflare.

A tentativa anterior de iniciar o servidor local com `python3` falhou porque o executável disponível no Windows não abriu. Não registrar a interface ou o backend como testados por causa da leitura dos arquivos.

## Como atualizar este registro

Registrar a data, a decisão e a autorização explícita do Gui quando houver novas aprovações. Manter propostas pendentes separadas do que foi aprovado. Uma decisão de estratégia não autoriza sua implementação automática, nem operações de Git ou publicação.
