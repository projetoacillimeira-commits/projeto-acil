// Provedores de IA com fallback automático.
// Ordem padrão: Groq (grátis) → Gemini (grátis) → Claude → OpenAI.
// Basta definir a chave da API na Vercel; o que não tiver chave é ignorado.

function parseDataUrl(dataUrl) {
  const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(dataUrl || '');
  return m ? { mimeType: m[1], data: m[2] } : null;
}

async function postJson(url, headers, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json.error && (json.error.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return json;
}

const providers = {
  groq: {
    available: () => !!process.env.GROQ_API_KEY,
    supportsImage: false,
    async run({ system, user }) {
      const data = await postJson(
        'https://api.groq.com/openai/v1/chat/completions',
        { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        {
          model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          temperature: 0.7,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        }
      );
      return data.choices[0].message.content;
    },
  },

  gemini: {
    available: () => !!process.env.GEMINI_API_KEY,
    supportsImage: true,
    async run({ system, user, image }) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      const parts = [{ text: user }];
      if (image) parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
      const data = await postJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {},
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0.7 },
        }
      );
      return data.candidates[0].content.parts.map((p) => p.text || '').join('');
    },
  },

  anthropic: {
    available: () => !!process.env.ANTHROPIC_API_KEY,
    supportsImage: true,
    async run({ system, user, image }) {
      const content = [{ type: 'text', text: user }];
      if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.mimeType, data: image.data } });
      const data = await postJson(
        'https://api.anthropic.com/v1/messages',
        { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        {
          model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
          max_tokens: 1500,
          system,
          messages: [{ role: 'user', content }],
        }
      );
      return data.content.map((c) => c.text || '').join('');
    },
  },

  openai: {
    available: () => !!process.env.OPENAI_API_KEY,
    supportsImage: true,
    async run({ system, user, image }) {
      const content = [{ type: 'text', text: user }];
      if (image) content.push({ type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.data}` } });
      const data = await postJson(
        'https://api.openai.com/v1/chat/completions',
        { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        {
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.7,
          messages: [{ role: 'system', content: system }, { role: 'user', content }],
        }
      );
      return data.choices[0].message.content;
    },
  },
};

const ORDER = (process.env.AI_PROVIDER_ORDER || 'groq,gemini,anthropic,openai')
  .split(',')
  .map((s) => s.trim())
  .filter((s) => providers[s]);

// Tenta cada provedor disponível em ordem; se um falhar, passa para o próximo.
async function generateText({ system, user, image }) {
  const available = ORDER.filter((name) => providers[name].available());
  if (!available.length) {
    const err = new Error('Nenhuma chave de IA configurada. Adicione GROQ_API_KEY ou GEMINI_API_KEY na Vercel.');
    err.status = 503;
    throw err;
  }
  // Com imagem, prioriza provedores que enxergam imagem.
  const ordered = image
    ? [...available.filter((n) => providers[n].supportsImage), ...available.filter((n) => !providers[n].supportsImage)]
    : available;

  let lastError;
  for (const name of ordered) {
    try {
      const text = await providers[name].run({ system, user, image: providers[name].supportsImage ? image : null });
      return { text: text.trim(), provider: name, imageIgnored: !!image && !providers[name].supportsImage };
    } catch (e) {
      lastError = e;
      console.error(`[ai] ${name} falhou:`, e.message);
    }
  }
  const err = new Error('Os provedores de IA falharam. Tente de novo em instantes.');
  err.status = 502;
  err.detail = lastError && lastError.message;
  throw err;
}

module.exports = { generateText, parseDataUrl };
