import { obterIconeCategoria } from './utils.js';

// 👉 Só o título com ícone e tipo (ex: Arroz (Compra))
export function formatarTitulo(item, tipo = 'tarefa') {
  const { titulo = '', nome = '', produto = '', title = '' } = item;
  const textoBase = titulo || nome || produto || title || 'Sem título';
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  return `${textoBase} (${tipoCapitalizado})`;
}

// 👉 Exibição detalhada com emojis (e tipo passado corretamente!)
export function formatarExibicao(item, tipo = 'tarefa') {
  const {
    categoria = '',
    prioridade = '',
    prazo = '',
    descricao = '',
    quantidade = '',
    preco = '',
    dosagem = '',
    horario = '',
    frequencia = '',
    objetivo = '',
    tarefa = '',
    valor = '',
    vencimento = '',
    tipo: especialidade = '',
    data = '',
    refeicoes = [],
    diasTexto = '',
    produtoFormatado = '',
    recorrenciaFormatada = '',
    observacoes = ''
  } = item;

  const icone = obterIconeCategoria(categoria);

  // Garantir que tipo está definido e em lowercase
  const tipoTratado = (tipo || 'tarefa').toLowerCase();

  switch (tipoTratado) {
    case 'compra':
      return `📂 Categoria: ${icone} ${categoria}
🔢 Quantidade: ${quantidade || '-'}
💰 Preço: ${preco || '-'}
⚡ Prioridade: ${prioridade || '-'}`;

    case 'remedio':
      return `💊 Dosagem: ${dosagem || '-'}
⏰ Horário: ${horario || '-'}
📆 Frequência: ${frequencia || '-'}`;

    case 'meta':
      return `🎯 Objetivo: ${objetivo || '-'}
📅 Prazo: ${prazo || '-'}`;

    case 'limpeza':
      return `🧽 Tarefa: ${tarefa || '-'}
📅 Frequência: ${frequencia || '-'}`;

    case 'financa':
      return `💰 Valor: R$ ${valor ? parseFloat(valor).toFixed(2) : '-'}
📅 Data: ${data || '-'}
📝 Obs: ${observacoes || 'N/A'}`;

    case 'produto':
      return `🧴 Produto: ${produtoFormatado || '-'}
🔁 Recorrência: ${recorrenciaFormatada || '-'}
📆 Dias: ${diasTexto || '-'}`;


    case 'conta':
      const lembrete = item.lembreteData && item.lembreteHora
        ? `${item.lembreteData} às ${item.lembreteHora}`
        : 'N/A';

      return `
📝 Descrição: ${item.descricao || 'N/A'}
💰 Valor: R$ ${item.valor ? parseFloat(item.valor).toFixed(2) : '-'}
📅 Vencimento: ${item.vencimento || 'Não definida'}
✅ Paga: ${item.paga === 'sim' ? 'Sim' : item.paga === 'nao' ? 'Não' : 'N/A'}
🔁 Repetir: ${item.repetir || 'N/A'}
🔔 Lembrete: ${lembrete}
`.trim();



    case 'cardapio':
      return `📅 Data: ${data || '-'}
🍽️ Refeições: ${refeicoes.length > 0 ? refeicoes.join(', ') : '-'}`;

    default:
      return `📂 Categoria: ${icone} ${categoria}
⏳ Prazo: ${prazo || '-'}
⚡ Prioridade: ${prioridade || '-'}
📝 Descrição: ${descricao || '-'}`;
  }
}
