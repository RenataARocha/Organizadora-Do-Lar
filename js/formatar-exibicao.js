// 👉 Corrigir tipos antigos
function corrigirTipoItem(item) {
  if (!item.tipo && item.titulo) {
    const t = item.titulo.toLowerCase();
    if (t.includes('bolet') || t.includes('escola')) item.tipo = 'conta';
    else if (t.includes('skincare')) item.tipo = 'skincare';
    else if (t.includes('cronograma') || t.includes('cardápio')) item.tipo = 'cronograma';
    else if (t.includes('anhanguera')) item.tipo = 'instituicao';
    else if (t.includes('limpeza')) item.tipo = 'limpeza';
    else if (t.includes('consulta')) item.tipo = 'consulta';
  }


  // Corrigir prefixos bagunçados (limpa o tipo)
  if (item.tipo?.startsWith('conta-')) item.tipo = 'conta';
  if (item.tipo?.startsWith('skincare-')) item.tipo = 'skincare';
}

function limparPrefixo(titulo) {
  return titulo.replace(/^(💸 Conta: |💊 Remédio: |📅 Cronograma: |🧹 Limpeza: |✨ Skincare: |🎯 Meta: |🩺 Consulta: |✅ Tarefa: |🛒 Compra: |📌 )/, '').trim();
}

// 👉 Só o título com ícone e tipo
export function formatarTitulo(item, tipo = 'tarefa') {
  corrigirTipoItem(item); // mantém isso, importante!


  let tituloOriginal = item.titulo || item.title || item.nome || item.produto || '';
  let tituloLimpo = limparPrefixo(tituloOriginal || '');


  // Determina o tipo limpo (lowercase e sem prefixos bagunçados)
  let tipoLimpo = (item.tipo || tipo).toLowerCase();
  if (tipoLimpo.startsWith('conta-')) tipoLimpo = 'conta';
  if (tipoLimpo.startsWith('skincare-')) tipoLimpo = 'skincare';
  // adiciona outros prefixos se precisar

  const textoBase = tituloLimpo || item.nome || item.produto || item.title || 'Sem título';

  let prefixo = '';

  switch (tipoLimpo) {
    case 'meta':
      prefixo = '🎯 Meta: ';
      break;
    case 'conta':
      prefixo = '💸 Conta: ';
      break;
    case 'remedio':
      prefixo = '💊 Remédio: ';
      break;
    case 'compra':
      prefixo = '🛒 Compra: ';
      break;
    case 'cronograma':
      prefixo = '📅 Cronograma: ';
      break;
    case 'instituicao':
      prefixo = '📌 ';
      break;
    case 'limpeza':
      prefixo = '🧹 Limpeza: ';
      break;
    case 'skincare':
      prefixo = '✨ Skincare: ';
      break;
    case 'consulta':
      prefixo = '🩺 Consulta: ';
      break;
    default:
      prefixo = '✅ Tarefa: ';
  }

  // Remove emoji e espaços do prefixo pra comparar só o texto
  const prefixoTexto = prefixo.replace(/^[^\w\s]+ */, '').toLowerCase();
  const tituloLimpoMinusculo = tituloLimpo.toLowerCase();

  // Se o título já começa com o texto do prefixo, não repete o prefixo
  if (tituloLimpoMinusculo.startsWith(prefixoTexto)) {
    prefixo = '';
  }

  return `${prefixo}${textoBase}`;
}
