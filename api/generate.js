// POST /api/generate
// Body: { loja_id?, menu, item, respostas: {campo: valor}, imagem?: "data:image/...;base64,..." }
const { MENUS } = require('../lib/catalog');
const { sb } = require('../lib/supabase');
const { generateText, parseDataUrl } = require('../lib/ai');

const UUID = /^[0-9a-f-]{36}$/i;
const BASE_SYSTEM = `Você é o assistente de marketing do "Marketing de Bolso", uma ferramenta para lojistas brasileiros que não têm agência.
Regras:
- Responda sempre em português do Brasil, com linguagem simples e direta.
- Entregue o conteúdo pronto para copiar e colar. Nada de introdução longa nem de explicar o que você vai fazer.
- Use os dados da loja (nome, nicho, cidade, bairro) quando fizer sentido, sem inventar informações como preços, endereços ou prêmios que não foram informados.
- Se faltar um dado importante, escreva a versão mais útil possível e marque entre colchetes o que o lojista deve trocar, ex.: [preço].
- Use formatação leve: títulos curtos e listas quando ajudar.`;

function findItem(menuId, itemId) {
  const menu = MENUS.find((m) => m.id === menuId);
  const item = menu && menu.itens.find((i) => i.id === itemId);
  return item ? { menu, item } : null;
}

function buildPrompt(loja, menu, item, respostas) {
  const system = `${BASE_SYSTEM}\n\nTarefa específica (${menu.nome} > ${item.nome}):\n${item.instrucao}`;
  const lines = [];
  if (loja) {
    lines.push('DADOS DA LOJA:');
    lines.push(`- Nome: ${loja.nome}`);
    if (loja.nicho) lines.push(`- Nicho: ${loja.nicho}`);
    if (loja.cidade) lines.push(`- Cidade: ${loja.cidade}`);
    if (loja.bairro) lines.push(`- Bairro: ${loja.bairro}`);
    if (loja.endereco) lines.push(`- Endereço: ${loja.endereco}`);
    if (loja.instagram) lines.push(`- Instagram: @${loja.instagram.replace(/^@/, '')}`);
    if (loja.tom) lines.push(`- Tom padrão da marca: ${loja.tom}`);
    lines.push('');
  }
  lines.push('PEDIDO DO LOJISTA:');
  for (const campo of item.campos) {
    const valor = respostas[campo.campo];
    if (valor === undefined || valor === '') continue;
    lines.push(`- ${campo.label}: ${String(valor).slice(0, 2000)}`);
  }
  return { system, user: lines.join('\n') };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const body = req.body || {};
    const found = findItem(body.menu, body.item);
    if (!found) return res.status(400).json({ erro: 'Menu ou item inválido' });
    const { menu, item } = found;

    for (const campo of item.campos) {
      if (campo.obrigatorio && !(body.respostas && body.respostas[campo.campo])) {
        return res.status(400).json({ erro: `Preencha: ${campo.label}` });
      }
    }

    let loja = null;
    if (body.loja_id) {
      if (!UUID.test(body.loja_id)) return res.status(400).json({ erro: 'Loja inválida' });
      const rows = await sb(`lojas?id=eq.${body.loja_id}&select=*`);
      loja = rows && rows[0];
    }

    const image = body.imagem ? parseDataUrl(body.imagem) : null;
    if (body.imagem && !image) return res.status(400).json({ erro: 'Imagem inválida (use PNG, JPG, WEBP ou GIF)' });

    const { system, user } = buildPrompt(loja, menu, item, body.respostas || {});
    const result = await generateText({ system, user, image });

    let geracaoId = null;
    if (loja) {
      try {
        const saved = await sb('geracoes', {
          method: 'POST',
          body: {
            loja_id: loja.id,
            menu: menu.id,
            item: item.id,
            input: body.respostas || {},
            output: result.text,
            provider: result.provider,
          },
        });
        geracaoId = saved && saved[0] && saved[0].id;
      } catch (e) {
        console.error('[generate] não salvou histórico:', e.message);
      }
    }

    return res.status(200).json({
      output: result.text,
      provider: result.provider,
      imageIgnored: result.imageIgnored,
      id: geracaoId,
    });
  } catch (e) {
    console.error('[generate]', e.message, e.detail || '');
    const status = e.status || 500;
    const erro = status === 500 ? 'Erro interno ao gerar o conteúdo' : e.message;
    return res.status(status).json({ erro });
  }
};
