// Catálogo de menus, itens e campos do Marketing de Bolso.
// O painel lê este arquivo via /api/catalog e monta os formulários sozinho.
// Para adicionar um novo item, basta incluir um objeto em "itens".

const PRODUTO = { campo: 'produto', label: 'Produto ou serviço', tipo: 'text', obrigatorio: true, placeholder: 'Ex.: Vestido midi floral' };
const OFERTA = { campo: 'oferta', label: 'Oferta ou promoção (opcional)', tipo: 'text', placeholder: 'Ex.: 20% off até domingo' };
const TOM = {
  campo: 'tom', label: 'Tom de voz', tipo: 'select',
  opcoes: ['Profissional', 'Descontraído', 'Divertido', 'Luxo / premium', 'Urgente (promoção)'],
};
const EXTRA = { campo: 'extra', label: 'Detalhes extras (opcional)', tipo: 'textarea', placeholder: 'Qualquer informação que ajude: público, diferenciais, o que já tentou...' };
const IMAGEM = { campo: 'imagem', label: 'Foto do produto (opcional)', tipo: 'imagem' };

const MENUS = [
  {
    id: 'imagens',
    nome: 'Imagens',
    icone: '🖼️',
    descricao: 'Prompts de imagem, fotos de produto e visual da loja',
    itens: [
      {
        id: 'foto_produto',
        nome: 'Foto profissional de produto',
        dor: 'Minha foto de produto está feia ou amadora',
        campos: [PRODUTO, IMAGEM, {
          campo: 'estilo', label: 'Estilo da foto', tipo: 'select',
          opcoes: ['Fundo branco (catálogo)', 'Fundo colorido', 'Lifestyle (em uso)', 'Flat lay (vista de cima)', 'Minimalista escuro'],
        }, EXTRA],
        instrucao: 'Crie 3 prompts de imagem em inglês para gerar ou orientar uma foto profissional do produto (serve para Gemini, ChatGPT Image, Midjourney ou Canva). Para cada prompt, inclua: enquadramento, iluminação, fundo, cores, proporção (1:1 ou 4:5) e um texto curto em português explicando o que pedir ao fotógrafo ou o que ajustar na foto que já tem. Se houver foto anexada, descreva o que melhorar nela.',
      },
      {
        id: 'prompt_loja',
        nome: 'Ambiente e foto da loja',
        dor: 'Quero mostrar a loja de um jeito bonito no Instagram e no Google',
        campos: [{
          campo: 'tipo_ambiente', label: 'Tipo de ambiente', tipo: 'select',
          opcoes: ['Fachada', 'Vitrine', 'Interior / salão', 'Balcão / caixa', 'Equipe trabalhando'],
        }, EXTRA],
        instrucao: 'Crie 3 prompts de imagem em inglês para o ambiente descrito, com iluminação natural, ângulo, clima e cores da marca, e uma orientação prática em português para tirar essa foto com celular (luz, ângulo, horário, o que tirar do quadro).',
      },
      {
        id: 'capa_destaque',
        nome: 'Capas de destaques do Instagram',
        dor: 'Meus destaques estão sem capa ou sem padrão',
        campos: [{ campo: 'categorias', label: 'Destaques que você quer (separe por vírgula)', tipo: 'text', obrigatorio: true, placeholder: 'Ex.: Novidades, Preços, Entrega, Depoimentos' }, TOM],
        instrucao: 'Para cada destaque, sugira: nome curto (até 12 caracteres), ícone ou elemento visual, cor de fundo em hexadecimal coerente com o nicho, e um prompt de imagem em inglês para gerar a capa. Termine com uma regra de padrão visual para manter todas as capas iguais.',
      },
      {
        id: 'banner',
        nome: 'Banner e capa de site ou link',
        dor: 'Preciso de um banner para anúncio, link na bio ou site',
        campos: [PRODUTO, OFERTA, {
          campo: 'formato', label: 'Onde vai aparecer', tipo: 'select',
          opcoes: ['Post quadrado 1:1', 'Stories 9:16', 'Banner de site 16:9', 'Capa de anúncio 4:5'],
        }, EXTRA],
        instrucao: 'Crie 3 prompts de imagem em inglês para banners com espaço reservado para o texto, na proporção indicada, e 3 frases curtas de chamada em português para escrever sobre a arte. Explique em uma linha como fica a hierarquia visual (título, oferta, botão).',
      },
      {
        id: 'modelo_ia',
        nome: 'Produto em modelo gerado por IA',
        dor: 'Quero mostrar a roupa ou o produto em alguém sem fazer ensaio',
        campos: [PRODUTO, {
          campo: 'modelo', label: 'Perfil do modelo', tipo: 'select',
          opcoes: ['Mulher jovem', 'Mulher madura', 'Homem jovem', 'Homem maduro', 'Sem pessoa (só produto)'],
        }, EXTRA],
        instrucao: 'Crie 3 prompts de imagem em inglês para mostrar o produto em uso, com modelo, pose, cenário e iluminação compatíveis com o nicho. Inclua um aviso curto em português: use IA só com produto real e não apresente o modelo como cliente real.',
      },
    ],
  },
  {
    id: 'atendimento',
    nome: 'Atendimento',
    icone: '💬',
    descricao: 'Mensagens de WhatsApp para abordar, atender, recuperar e vender',
    itens: [
      {
        id: 'abordagem',
        nome: 'Primeira abordagem ao cliente',
        dor: 'Não sei como começar a conversa com quem chama',
        campos: [PRODUTO, TOM, EXTRA],
        instrucao: 'Escreva 3 mensagens de primeiro contato para WhatsApp, curtas (até 4 linhas), com saudação pelo nome da loja, uma pergunta que faça o cliente responder e um próximo passo claro. Uma versão para quem perguntou preço, uma para quem viu o anúncio e uma para quem passou na loja.',
      },
      {
        id: 'fluxo',
        nome: 'Fluxo completo de atendimento',
        dor: 'Perco vendas porque respondo sem método',
        campos: [PRODUTO, OFERTA, EXTRA],
        instrucao: 'Monte um fluxo de atendimento em 5 etapas (cumprimento, descoberta da necessidade, apresentação, objeção, fechamento). Em cada etapa dê a mensagem pronta e a resposta para a dúvida mais comum sobre o produto.',
      },
      {
        id: 'recuperacao',
        nome: 'Recuperar cliente que sumiu',
        dor: 'Cliente pediu orçamento e não respondeu mais',
        campos: [PRODUTO, {
          campo: 'tempo', label: 'Há quanto tempo sumiu?', tipo: 'select',
          opcoes: ['Algumas horas', '1 a 2 dias', 'Uma semana', 'Mais de um mês'],
        }, EXTRA],
        instrucao: 'Escreva 3 mensagens de recuperação, em tom leve e sem pressão, que retomem a conversa, tragam algo novo (benefício, prazo ou oferta) e deixem uma saída fácil para o cliente responder não.',
      },
      {
        id: 'promocao',
        nome: 'Mensagem de promoção',
        dor: 'Quero avisar a promoção para a base sem parecer spam',
        campos: [PRODUTO, OFERTA, TOM],
        instrucao: 'Escreva 2 mensagens de promoção para envio em lista de transmissão ou status do WhatsApp, com oferta clara, prazo, um motivo para agir agora e um botão de resposta (ex.: responda QUERO). Inclua uma versão de 1 linha para stories.',
      },
      {
        id: 'lancamento',
        nome: 'Anúncio de lançamento',
        dor: 'Tenho um produto novo e não sei como divulgar',
        campos: [PRODUTO, EXTRA, TOM],
        instrucao: 'Monte um mini-plano de lançamento em 3 dias (antes, dia do lançamento, depois) com a mensagem de WhatsApp de cada dia e a legenda de Instagram correspondente.',
      },
      {
        id: 'novidades',
        nome: 'Novidades e chegadas',
        dor: 'Chegou produto novo e quero avisar quem já é cliente',
        campos: [PRODUTO, TOM],
        instrucao: 'Escreva 2 mensagens curtas avisando a chegada de produto novo para clientes antigos, com um motivo para visitar a loja ou responder, e sugira o melhor dia e horário para enviar.',
      },
    ],
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    icone: '📸',
    descricao: 'Bio, legendas, hashtags, dicas e alcance',
    itens: [
      {
        id: 'bio',
        nome: 'Bio que vende',
        dor: 'Meu perfil não diz o que eu faço nem o que o cliente ganha',
        campos: [PRODUTO, {
          campo: 'bio_atual', label: 'Bio atual (se tiver)', tipo: 'textarea', placeholder: 'Cole sua bio atual aqui',
        }, { campo: 'acao', label: 'Ação que quer do visitante', tipo: 'select', opcoes: ['Chamar no WhatsApp', 'Comprar pelo link', 'Agendar', 'Visitar a loja', 'Seguir'] }],
        instrucao: 'Escreva 3 opções de bio para Instagram com no máximo 150 caracteres cada, com uma linha de proposta de valor, uma linha de prova ou diferencial e uma chamada para ação. Se houver bio atual, aponte em 3 linhas o que melhorar nela.',
      },
      {
        id: 'legendas',
        nome: 'Legendas prontas para post',
        dor: 'Não sei o que escrever na legenda',
        campos: [PRODUTO, OFERTA, TOM],
        instrucao: 'Escreva 3 legendas de Instagram para post de produto: uma de história, uma de benefício e uma de promoção. Cada uma com primeira linha de gancho forte, corpo curto e CTA. Sem hashtags na legenda, elas vêm no item de hashtags.',
      },
      {
        id: 'hashtags',
        nome: 'Hashtags certas para o nicho',
        dor: 'Uso hashtag genérica e não aparece para ninguém',
        campos: [PRODUTO, { campo: 'cidade_hash', label: 'Atua em uma cidade específica?', tipo: 'text', placeholder: 'Ex.: Limeira' }],
        instrucao: 'Monte 3 grupos de hashtags de 8 a 12 itens cada: nicho amplo, nicho específico e local (se a cidade foi informada). Misture tamanhos de alcance e explique em uma linha como usar em 1 post.',
      },
      {
        id: 'viralizar',
        nome: 'Ideias de post para alcance',
        dor: 'Meu alcance caiu e quero ideias que circulem',
        campos: [PRODUTO, EXTRA],
        instrucao: 'Liste 5 ideias de post pensadas para alcance (não só venda): formato (carrossel, reel, foto), gancho da primeira linha, o que mostrar e por que as pessoas compartilhariam. Inclua 1 ideia para cada: bastidor, dica, resultado de cliente e pergunta para comentário.',
      },
      {
        id: 'dicas',
        nome: 'Dicas rápidas de Instagram',
        dor: 'Quero melhorar o perfil sem gastar tempo',
        campos: [{ campo: 'objetivo', label: 'Seu principal problema hoje', tipo: 'select', opcoes: ['Pouco alcance', 'Poucos seguidores', 'Ninguém comenta', 'Não chega cliente pelo direct', 'Perfil desorganizado'] }],
        instrucao: 'Dê um checklist de 7 ajustes práticos para o problema escolhido, do mais rápido para o mais demorado, cada um com o que fazer em no máximo 2 linhas e quanto tempo leva.',
      },
    ],
  },
  {
    id: 'tiktok',
    nome: 'TikTok',
    icone: '🎵',
    descricao: 'Roteiros, ganchos e legendas para vídeo curto',
    itens: [
      {
        id: 'roteiro',
        nome: 'Roteiro de vídeo curto',
        dor: 'Não sei o que falar no vídeo e fico travado',
        campos: [PRODUTO, {
          campo: 'duracao', label: 'Duração', tipo: 'select', opcoes: ['15 segundos', '30 segundos', '60 segundos'],
        }, EXTRA],
        instrucao: 'Escreva um roteiro com gancho nos primeiros 3 segundos, desenvolvimento e chamada final. Divida em cenas com o que falar e o que mostrar na tela. Mantenha o ritmo do tempo informado.',
      },
      {
        id: 'ganchos',
        nome: 'Ganchos para os primeiros 3 segundos',
        dor: 'As pessoas passam direto pelo meu vídeo',
        campos: [PRODUTO, TOM],
        instrucao: 'Escreva 10 ganchos de abertura, cada um com a frase falada e o que aparece na tela. Varie entre pergunta, erro comum, antes e depois, segredo do nicho e demonstração.',
      },
      {
        id: 'legenda_tiktok',
        nome: 'Legenda e hashtags para TikTok',
        dor: 'Não sei escrever a legenda que puxa visualização',
        campos: [PRODUTO, OFERTA],
        instrucao: 'Escreva 3 legendas curtas (até 100 caracteres), cada uma com um gancho, e 2 conjuntos de 4 a 6 hashtags, misturando nicho e tendência geral.',
      },
      {
        id: 'ideias',
        nome: 'Ideias de vídeo para a semana',
        dor: 'Não tenho ideia para postar toda semana',
        campos: [PRODUTO, { campo: 'frequencia', label: 'Quantos vídeos por semana?', tipo: 'select', opcoes: ['3', '5', '7'] }],
        instrucao: 'Monte um calendário de vídeos para a semana com o tipo de cada um (dica, bastidor, cliente, produto, opinião) e uma ideia específica por dia com gancho.',
      },
    ],
  },
  {
    id: 'anuncios',
    nome: 'Anúncios',
    icone: '📣',
    descricao: 'Tráfego pago: textos, públicos e diagnóstico de campanha',
    itens: [
      {
        id: 'textos_anuncio',
        nome: 'Textos de anúncio (Meta Ads)',
        dor: 'Meu anúncio tem pouco clique',
        campos: [PRODUTO, OFERTA, {
          campo: 'objetivo', label: 'Objetivo da campanha', tipo: 'select',
          opcoes: ['Mensagens no WhatsApp', 'Visitas ao perfil', 'Vendas no site', 'Visitas à loja'],
        }, EXTRA],
        instrucao: 'Escreva 3 variações completas de anúncio (título, texto principal de até 3 linhas e descrição) e 2 variações de criativo em texto para vídeo (gancho falado nos primeiros 3 segundos). Adeque ao objetivo escolhido e termine com uma sugestão de teste A/B.',
      },
      {
        id: 'publico',
        nome: 'Público e segmentação',
        dor: 'Não sei para quem anunciar',
        campos: [PRODUTO, {
          campo: 'raio', label: 'Área de alcance', tipo: 'select', opcoes: ['Só a cidade', 'Cidade + 10 km', 'Região', 'Todo o Brasil'],
        }, EXTRA],
        instrucao: 'Descreva 3 públicos (quente, morno e frio) com idade, interesses sugeridos, comportamento e o motivo de cada um. Indique o orçamento diário inicial recomendado para teste de 7 dias e o que observar.',
      },
      {
        id: 'diagnostico',
        nome: 'Diagnóstico da campanha',
        dor: 'Gastei e não sei o que está dando errado',
        campos: [{ campo: 'metricas', label: 'Números da campanha (cole do gerenciador)', tipo: 'textarea', obrigatorio: true, placeholder: 'Ex.: Gasto R$ 210, 4.200 alcance, CTR 0,6%, 3 conversas, CPA R$ 70' }, { campo: 'objetivo', label: 'O que você queria com ela?', tipo: 'text' }],
        instrucao: 'Analise as métricas informadas, aponte o principal gargalo (criativo, público, oferta ou página de destino), explique em linguagem simples por que, e liste 3 ajustes em ordem de prioridade com o que mudar em cada um.',
      },
      {
        id: 'nome_campanha',
        nome: 'Organização da campanha',
        dor: 'Minha conta de anúncio está bagunçada',
        campos: [PRODUTO, { campo: 'quantidade', label: 'Quantos anúncios pretende criar?', tipo: 'select', opcoes: ['1 a 3', '4 a 6', 'Mais de 6'] }],
        instrucao: 'Monte a estrutura da campanha (campanha, conjuntos e anúncios), nomeie cada nível com um padrão simples e liste o que testar primeiro.',
      },
    ],
  },
  {
    id: 'canva',
    nome: 'Canva',
    icone: '🎨',
    descricao: 'Passo a passo para criar artes no Canva',
    itens: [
      {
        id: 'arte_post',
        nome: 'Arte de post no Canva',
        dor: 'Não sei montar a arte no Canva e fica feio',
        campos: [PRODUTO, OFERTA, {
          campo: 'formato', label: 'Formato', tipo: 'select', opcoes: ['Post 1:1', 'Stories 9:16', 'Post 4:5', 'Apresentação'],
        }, EXTRA],
        instrucao: 'Monte um passo a passo para criar a arte no Canva: formato, paleta de 3 cores em hexadecimal, 2 fontes (uma título e uma texto), disposição dos elementos (título, imagem, oferta, chamada) e o texto exato de cada campo. Diga o que pesquisar no Canva para cada elemento, sem inventar nomes de menus.',
      },
      {
        id: 'paleta',
        nome: 'Paleta e identidade da marca',
        dor: 'Minhas artes não têm cara de marca',
        campos: [{ campo: 'estilo_marca', label: 'Como a marca deve parecer?', tipo: 'select', opcoes: ['Moderna', 'Clássica', 'Jovem e divertida', 'Luxo', 'Natural / orgânica'] }, { campo: 'nicho_cores', label: 'Nicho / segmento', tipo: 'text', obrigatorio: true }],
        instrucao: 'Crie uma paleta de 4 cores em hexadecimal (principal, secundária, destaque e neutra), 2 combinações de fonte, e 3 regras simples para manter as artes consistentes.',
      },
      {
        id: 'texto_arte',
        nome: 'Textos curtos para arte',
        dor: 'Não sei o que escrever dentro da arte',
        campos: [PRODUTO, OFERTA, TOM],
        instrucao: 'Escreva 5 opções de texto para usar dentro de uma arte, cada uma com título (até 6 palavras), subtítulo (até 10 palavras) e chamada de botão (até 3 palavras).',
      },
    ],
  },
  {
    id: 'capcut',
    nome: 'CapCut',
    icone: '🎬',
    descricao: 'Edição de vídeo: cortes, legendas, transições e ritmo',
    itens: [
      {
        id: 'roteiro_edicao',
        nome: 'Roteiro de edição passo a passo',
        dor: 'Gravei o vídeo e não sei como editar no CapCut',
        campos: [{ campo: 'tipo_video', label: 'Tipo de vídeo', tipo: 'select', opcoes: ['Vídeo de produto', 'Vídeo falando para a câmera', 'Antes e depois', 'Bastidor da loja'] }, { campo: 'duracao', label: 'Duração do material bruto', tipo: 'text', placeholder: 'Ex.: 2 minutos' }, EXTRA],
        instrucao: 'Monte o passo a passo de edição: como cortar as partes ruins, ordem das cenas, onde colocar legenda e música, velocidade, e 3 transições sugeridas. Use nomes de recursos genéricos e diga para procurar pela função no próprio app.',
      },
      {
        id: 'legendas_video',
        nome: 'Legendas e textos na tela',
        dor: 'Preciso colocar legenda e texto no vídeo',
        campos: [{ campo: 'roteiro_fala', label: 'Cole o que você fala no vídeo', tipo: 'textarea', obrigatorio: true }, TOM],
        instrucao: 'Divida o texto falado em legendas curtas (máximo 6 palavras por tela), indique o destaque visual de cada uma (palavra em negrito ou cor) e sugira onde colocar na tela para não cobrir o rosto.',
      },
      {
        id: 'ritmo',
        nome: 'Ritmo e gancho do vídeo',
        dor: 'Meu vídeo fica arrastado e as pessoas saem',
        campos: [{ campo: 'duracao', label: 'Duração atual do vídeo', tipo: 'text', placeholder: 'Ex.: 45 segundos' }, EXTRA],
        instrucao: 'Diga em 5 linhas o que cortar ou acelerar para ganhar retenção, sugira onde colocar um gancho ou corte de movimento, e indique um tamanho ideal para o formato.',
      },
    ],
  },
  {
    id: 'loja',
    nome: 'Dia a dia da loja',
    icone: '🏪',
    descricao: 'Avisos, vitrine, mensagens rápidas e dicas gerais',
    itens: [
      {
        id: 'aviso',
        nome: 'Aviso de horário ou feriado',
        dor: 'Preciso avisar que a loja vai fechar ou mudar horário',
        campos: [{ campo: 'aviso', label: 'O que aconteceu?', tipo: 'text', obrigatorio: true, placeholder: 'Ex.: Fechado dia 15 por feriado' }],
        instrucao: 'Escreva 3 avisos prontos (WhatsApp, Instagram e Google Meu Negócio), curtos e claros, com a data e o horário em destaque.',
      },
      {
        id: 'vitrine',
        nome: 'Organizar a vitrine ou catálogo',
        dor: 'Não sei quais produtos destacar',
        campos: [{ campo: 'produtos', label: 'Liste seus produtos principais', tipo: 'textarea', obrigatorio: true }],
        instrucao: 'Organize os produtos em 3 grupos (destaque para atrair, produtos de margem, produtos para completar a venda), sugira a ordem de exibição e um combo ou kit para cada grupo.',
      },
      {
        id: 'dica_dia',
        nome: 'Dica rápida do dia',
        dor: 'Quero uma ação simples para fazer hoje',
        campos: [{ campo: 'momento', label: 'Como está o movimento?', tipo: 'select', opcoes: ['Parado', 'Normal', 'Cheio', 'Não sei'] }],
        instrucao: 'Dê 3 ações que o lojista pode fazer hoje em menos de 15 minutos para o movimento informado, cada uma com o passo exato e a mensagem pronta se houver.',
      },
      {
        id: 'avaliacao',
        nome: 'Pedir avaliação no Google',
        dor: 'Tenho poucas avaliações no Google',
        campos: [PRODUTO, TOM],
        instrucao: 'Escreva 2 mensagens para pedir avaliação no Google ao cliente depois da compra, com link de instrução simples, e uma resposta padrão para avaliações positivas e outra para negativas.',
      },
    ],
  },
];

module.exports = { MENUS };
