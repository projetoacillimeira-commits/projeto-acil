// Cliente mínimo do Supabase via REST (sem dependências).
// Usa a service role key somente no servidor (Vercel), nunca no navegador.

async function sb(path, opts = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    const err = new Error('Banco de dados não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_KEY na Vercel.');
    err.status = 503;
    throw err;
  }
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method: opts.method || 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error('Erro no banco de dados');
    err.status = res.status;
    err.detail = text;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

module.exports = { sb };
