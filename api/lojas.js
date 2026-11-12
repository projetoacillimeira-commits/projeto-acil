// /api/lojas
// GET    → lista lojas
// POST   → cria loja { nome, nicho, cidade, bairro, endereco, instagram, tom }
// DELETE → /api/lojas?id=uuid
const { sb } = require('../lib/supabase');

const UUID = /^[0-9a-f-]{36}$/i;
const CAMPOS = ['nome', 'nicho', 'cidade', 'bairro', 'endereco', 'instagram', 'tom'];

function limpar(body) {
  const row = {};
  for (const c of CAMPOS) {
    if (body[c] !== undefined && body[c] !== null) row[c] = String(body[c]).trim().slice(0, 200);
  }
  return row;
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const rows = await sb('lojas?select=*&order=created_at.desc');
      return res.status(200).json(rows || []);
    }

    if (req.method === 'POST') {
      const row = limpar(req.body || {});
      if (!row.nome) return res.status(400).json({ erro: 'Informe o nome da loja' });
      const created = await sb('lojas', { method: 'POST', body: row });
      return res.status(201).json(created[0]);
    }

    if (req.method === 'DELETE') {
      const id = (req.query || {}).id;
      if (!id || !UUID.test(id)) return res.status(400).json({ erro: 'Loja inválida' });
      await sb(`lojas?id=eq.${id}`, { method: 'DELETE', prefer: 'return=minimal' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ erro: 'Método não permitido' });
  } catch (e) {
    console.error('[lojas]', e.message, e.detail || '');
    const status = e.status || 500;
    return res.status(status).json({ erro: status === 503 ? e.message : 'Erro ao acessar as lojas' });
  }
};
