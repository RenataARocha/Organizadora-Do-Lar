export function obterIconeCategoria(categoria) {
  const icones = {
    tarefas: '📝',
    contas: '💸',
    remedios: '💊',
    consultas: '🩺',
    compras: '🛍️',
    cardapio: '🍽️',
    financas: '📊',
    limpeza: '🧹',
    skincare: '💅',
    cronograma: '💇‍♀️'
  };

  return icones[categoria] || '📌';
}
