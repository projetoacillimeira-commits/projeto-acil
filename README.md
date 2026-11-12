# Marketing de Bolso

Painel para lojistas resolverem o dia a dia de marketing sozinhos: prompts de imagem, mensagens de WhatsApp, legendas, bio, hashtags, roteiros de TikTok, textos de anúncio, passo a passo de Canva e CapCut.

Stack 100% gratuita no começo:
- **Frontend**: HTML + JavaScript puro (`public/index.html`), sem build
- **Backend**: funções serverless da Vercel (`api/`)
- **Banco**: Supabase (plano grátis)
- **IA**: Groq e Gemini (chaves grátis), com Claude e OpenAI como opção paga

## Estrutura

```
public/index.html     painel completo (menus, formulários, resultados, lojas)
api/generate.js       gera o conteúdo com a IA
api/lojas.js          cadastro das lojas
api/catalog.js        devolve menus, itens e campos para o painel
lib/catalog.js        TODOS os menus e soluções (edite aqui para criar novos itens)
lib/ai.js             provedores de IA com fallback automático
lib/supabase.js       acesso ao banco via REST
supabase/schema.sql   tabelas do banco
```

Para criar uma nova solução, abra `lib/catalog.js`, escolha um menu e adicione um objeto em `itens` com `id`, `nome`, `dor`, `campos` e `instrucao`. O painel monta o formulário sozinho.

## Passo 1: Supabase (grátis)

1. Crie um projeto em supabase.com.
2. Abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e rode.
3. Em **Project Settings → API**, copie a **Project URL** e a **service_role key**.

A service role key fica só no servidor (Vercel). Nunca coloque ela no HTML.

## Passo 2: chaves de IA (escolha uma ou mais)

| Provedor | Onde pegar | Variável |
|---|---|---|
| Groq (grátis, recomendado) | console.groq.com | `GROQ_API_KEY` |
| Gemini (grátis, aceita imagem) | aistudio.google.com | `GEMINI_API_KEY` |
| Claude | console.anthropic.com | `ANTHROPIC_API_KEY` |
| OpenAI | platform.openai.com | `OPENAI_API_KEY` |

Se um provedor falhar ou estourar o limite grátis, o sistema tenta o próximo automaticamente.

## Passo 3: deploy na Vercel (grátis)

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório. Não há build command: deixe em branco.
3. Em **Settings → Environment Variables**, adicione:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - pelo menos uma chave de IA (ex.: `GROQ_API_KEY`)
4. Clique em **Deploy**.

Para trocar de modelo sem mexer no código, use `GROQ_MODEL`, `GEMINI_MODEL`, `ANTHROPIC_MODEL` ou `OPENAI_MODEL`. Para mudar a ordem dos provedores, use `AI_PROVIDER_ORDER` (ex.: `gemini,groq`).

## Rodar localmente

Use a CLI da Vercel (`npx vercel dev`) com um arquivo `.env.local` contendo as mesmas variáveis. Sem as variáveis, o painel abre e mostra os menus, mas gerar conteúdo e cadastrar lojas só funcionam depois de configurar.

## Próximos passos (quando for virar SaaS)

- Login por lojista (Supabase Auth) e uma tabela de lojas por usuário, com RLS
- Cobrança mensal (Stripe ou Mercado Pago) liberando o painel por assinatura
- Upload das imagens no Supabase Storage em vez de enviar pelo navegador
- Histórico de gerações no painel
