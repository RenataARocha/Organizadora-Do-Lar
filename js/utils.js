function normalizarCategoria(categoria) {
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .trim();
}

export function obterIconeCategoria(categoria) {
  const icones = {
    tarefa: '📝',
    estudo: '📚',
    trabalho: '💼',
    saude: '🩺',
    consulta: '🩺',
    remedio: '💊',
    conta: '💸',
    pix: '💸',
    compra: '🛍️',
    mercado: '🛒',
    limpeza: '🧹',
    skincare: '💅',
    cronograma: '💇‍♀️',
    alimentacao: '🍽️',
    cardapio: '🍱',
    exercicio: '🏃‍♀️',
    meditacao: '🧘‍♀️',
    lazer: '🎨',
    leitura: '📖',
    filme: '🎬',
    serie: '📺',
    organizacao: '🗂️',
    aniversario: '🎂',
    meta: '🎯',
    motivacao: '💖',
    conquista: '🏆',
    devocional: '🙏',
    familia: '👨‍👩‍👧',
    filho: '🧒',
    escola: '🏫',
    pessoal: '🌸',
    profissional: '💼',
    financeira: '💰',
    higiene: '🧼',
    farmacia: '💊',
    pet: '🐶',
    cozinha: '🍽️',
    cozinha: '🍳',
    banheiro: '🛁',
    sala: '🛋️',
    quarto: '🛏️',
    lavanderia: '🧺',
    quintal: '🌿',
    varanda: '🌤️',
    escritorio: '💻',
    garagem: '🚗',
    corredor: '🚪',
    entrada: '🏠',
    skincare: '💅',
    cabelo: '💇‍♀️',
    esfoliacao: '🧖‍♀️',
    hidratacao: '💧',
    limpeza: '🧼',
    tratamento: '🧪',
    maquiagem: '💄',
    tonico: '🌿',
    protetor: '🌞',
    noturno: '🌙',
    diurno: '☀️',// já que apareceu aí, bora adicionar também 💼
  };

  if (!categoria) return '❓';

  const chave = normalizarCategoria(categoria);
  return icones[chave] || '📌';
}
