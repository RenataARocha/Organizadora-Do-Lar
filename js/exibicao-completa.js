import { obterIconeCategoria } from './utils.js';

export function formatarExibicao(item, tipoItem) {
  const {
    titulo,
    descricao,
    categoria,
    prioridade,
    data,
    hora,
    diasSemana,
    recorrencia,
    lembrete,
    prazo,
    valor,
    pago,
    local,
    observacoes,
    frequencia,
    quantidade,
    tipoFinanceiro,
    tipoSkincare,
    alarme,
    duracao,
    produto,
    dosagem,
    cafe,
    almoco,
    lanche,
    jantar,
    horario,
    lembreteData,
    lembreteHora,
    produtoFormatado,
    diasTexto,
    recorrenciaFormatada,
    reminderDate,
    reminderTime
  } = item;

  const icone = obterIconeCategoria(categoria);

  const formatado = {
    titulo: titulo || 'Sem título',
    descricao: descricao || 'N/A',
    categoria: categoria || 'Não definida',
    prioridade: prioridade || 'Não definida',
    data: data || 'Não definida',
    hora: (hora && hora.trim() !== '') ? hora : '',
    diasSemana: (diasSemana && diasSemana.length > 0) ? diasSemana.join(', ') : 'N/A',
    recorrencia: recorrencia || 'N/A',
    lembrete: lembrete || 'N/A',
    prazo: prazo || 'N/A',
    valor: !isNaN(parseFloat(valor)) ? parseFloat(valor) : null,
    vencimento: item.vencimento || 'Não definida',
    pago: pago !== undefined ? (pago ? 'Sim' : 'Não') : 'N/A',
    local: local || 'N/A',
    observacoes: observacoes || 'N/A',
    frequencia: frequencia || 'N/A',
    quantidade: quantidade || 'N/A',
    tipoFinanceiro: tipoFinanceiro || 'N/A',
    tipoSkincare: tipoSkincare || 'N/A',
    alarme: alarme || 'N/A',
    duracao: duracao || 'N/A',
    produto: produto || 'N/A',
    dosagem: dosagem || 'N/A',
    cafe,
    almoco,
    lanche,
    jantar,
    tipo: item.tipo || 'N/A', // ✅ usa item.tipo direto aqui
    horario,
    lembreteData,
    lembreteHora,
    produtoFormatado: produtoFormatado || produto || 'N/A',
    diasTexto: diasTexto || diasSemana?.join(', ') || 'N/A',
    recorrenciaFormatada: recorrenciaFormatada || recorrencia || 'N/A',
    reminderDate,
    reminderTime
  };

  switch (tipoItem) {
    case 'tarefa':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Tarefa)</span></p>
<p><span class="text-pink-500">📂 Categoria:</span> ${icone} ${formatado.categoria}</p>
<p><span class="text-pink-500">⚡ Prioridade:</span> ${formatado.prioridade}</p>
<p><span class="text-pink-500">📝 Descrição:</span> ${formatado.descricao}</p>
<p><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p><span class="text-pink-500">⏰ Alarme:</span> ${formatado.hora}</p>
<p><span class="text-pink-500">🔁 Recorrência:</span> ${formatado.recorrencia}</p>
<p><span class="text-pink-500">📆 Dias da semana:</span> ${formatado.diasSemana}</p>
      `.trim();

    case 'meta':
      return `
<p><p><strong class="text-pink-500">${icone} ${formatado.titulo}</strong> <span class="italic">(Meta)</span></p>
<p><span class="text-pink-500">📂 Categoria:</span> ${icone} ${formatado.categoria}</p>
<p><span class="text-pink-500">📝 Descrição:</span> ${formatado.descricao}</p>
<p><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p><span class="text-pink-500">⏳ Prazo:</span> ${formatado.prazo}</p>
<p><span class="text-pink-500">⚡ Prioridade:</span> ${formatado.prioridade}</p>
<p><span class="text-pink-500">🔔 Lembrete:</span> ${formatado.lembrete}</p>
      `.trim();

    case 'consulta':
    case 'exame':
    case 'retorno': {
      const tipoFormatado = tipoItem.charAt(0).toUpperCase() + tipoItem.slice(1);

      return `
<p><strong class="text-pink-500">${item.titulo}</strong> <span class="italic">(${tipoFormatado})</span></p>
<p><span class="text-pink-500">📋 Especialidade:</span> ${item.descricao || '-'}</p>
<p><span class="text-pink-500">📅 Data:</span> ${item.data || '-'}${item.horario && item.horario.trim() !== '' ? ` às ${item.horario}` : ''}</p>
<p><span class="text-pink-500">📍 Local:</span> ${item.local || '-'}</p>
<p><span class="text-pink-500">📝 Observações:</span> ${item.observacoes || '-'}</p>
<p><span class="text-pink-500">🔁 Repetir:</span> ${item.repeticao || 'N/A'}</p>
<p><span class="text-pink-500">🔔 Lembrete:</span> ${item.lembreteData || 'N/A'} ${item.lembreteHora || ''}</p>
`.trim();
    }

    case 'conta':
      return `
<p><strong class="text-pink-500">${item.titulo || item.nome || 'Sem título'}</strong> <span class="italic">(Conta)</span></p>
<p><span class="text-pink-500">📝 Descrição:</span> ${item.descricao || 'N/A'}</p>
<p><span class="text-pink-500">💰 Valor:</span> R$ ${item.valor ? parseFloat(item.valor).toFixed(2) : '-'}</p>
<p><span class="text-pink-500">📅 Vencimento:</span> ${item.vencimento || 'Não definida'}</p>
<p><span class="text-pink-500">🔁 Repetir:</span> ${item.repetir || 'N/A'}</p>
<p><span class="text-pink-500">🔔 Lembrete:</span> ${item.lembreteData || 'N/A'} ${item.lembreteHora || ''}</p>
  `.trim();


    case 'remedio':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Remédio)</span></p>
<p><span class="text-pink-500">⚖️ Dosagem:</span> ${formatado.dosagem}</p>
<p><span class="text-pink-500">📆 Dias:</span> ${formatado.diasSemana}</p>
<p><span class="text-pink-500">🔁 Frequência:</span> ${formatado.frequencia}</p>
<p><span class="text-pink-500">⏰ Horário:</span> ${formatado.hora}</p>
<p><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p><span class="text-pink-500">⏳ Duração:</span> ${formatado.duracao}</p>
<p><span class="text-pink-500">📝 Observações:</span> ${formatado.observacoes}</p>
<p><span class="text-pink-500">🔔 Alarme:</span> ${formatado.alarme}</p>
      `.trim();

    case 'compra':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Compra)</span></p>
<p><span class="text-pink-500">📂 Categoria:</span> ${icone} ${formatado.categoria}</p>
<p><span class="text-pink-500">🔢 Quantidade:</span> ${formatado.quantidade}</p>
<p><span class="text-pink-500">⚡ Prioridade:</span> ${formatado.prioridade}</p>
      `.trim();


    case 'financa':
      const iconeTipo = obterIconeCategoria(item.tipoFinanceiro);
      const iconeCategoria = obterIconeCategoria(item.categoria);

      return `
    <p><strong class="text-pink-500">${iconeTipo} ${item.tipoFinanceiro}</strong> <span class="italic">(Finança)</span></p>
    <p><span class="text-pink-500">📂 Categoria:</span> ${iconeCategoria} ${item.categoria}</p>
    <p><span class="text-pink-500">💰 Valor:</span> R$ ${parseFloat(item.valor).toFixed(2)}</p>
    <p><span class="text-pink-500">📅 Data:</span> ${item.data}</p>
    <p><span class="text-pink-500">💳 Pagamento:</span> ${item.metodoPagamento || 'N/A'}</p>
    <p><span class="text-pink-500">📝 Obs:</span> ${item.observacoes || 'N/A'}</p>
  `.trim();


    case 'etapa':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Etapa)</span></p>
<p><span class="text-pink-500">📂 Tipo:</span> ${formatado.tipo}</p>
<p><span class="text-pink-500">📝 Descrição:</span> ${formatado.descricao}</p>
<p><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p><span class="text-pink-500">🔁 Recorrência:</span> ${formatado.recorrencia}</p>
<p><span class="text-pink-500">📆 Dias da Semana:</span> ${formatado.diasTexto}</p>
${formatado.horario ? `<p><span class="text-pink-500">⏱️ Horário:</span> ${formatado.horario}</p>` : ''}
${(formatado.lembreteData || formatado.lembreteHora) ? `
  <p><span class="text-pink-500">🔔 Lembrete:</span> ${formatado.lembreteData || ''} ${formatado.lembreteHora || ''}</p>` : ''}
${formatado.alarme ? `<p><span class="text-pink-500">⏰ Alarme:</span> ${formatado.alarme}</p>` : ''}
`.trim();

    case 'produto':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="text-pink-500 ml-4">📦 Produto:</span> ${formatado.produtoFormatado}</p>
${formatado.observacoes ? `<p class="text-sm"><span class="text-pink-500">📝 Observações:</span> ${formatado.observacoes}</p>` : ''}
<p class="text-sm"><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p class="text-sm"><span class="text-pink-500">🔄 Recorrência:</span> ${formatado.recorrenciaFormatada}</p>
<p class="text-sm"><span class="text-pink-500">📆 Dias da Semana:</span> ${formatado.diasTexto}</p>
${(formatado.reminderDate || formatado.reminderTime) ? `<p class="text-sm"><span class="text-pink-500">🔔 Lembrete:</span> ${formatado.reminderDate || ''} ${formatado.reminderTime || ''}</p>` : ''}
<p class="text-sm"><span class="text-pink-500">⏰ Alarme:</span> ${formatado.alarme}</p>
`.trim();

    case 'limpeza': {
      const formatado = {
        icone: obterIconeCategoria(item.comodo || 'entrada'),
        comodo: item.comodo || 'Cômodo não informado',
        titulo: 'Limpeza',
        descricao: item.descricao || 'Tarefa não informada',
        frequencia: item.frequencia || 'Nenhuma',
        data: item.data || 'N/A',  // Adicione formatação de data se necessário, ex: new Date(item.data).toLocaleDateString('pt-BR')
        hora: item.hora || 'N/A',
        lembreteData: item.lembreteData || item.data || 'N/A',  // Adicione formatação se necessário
        lembreteHora: item.lembreteHora || 'N/A'
      };

      const lembrete = (formatado.lembreteData && formatado.lembreteHora)
        ? `${formatado.lembreteData} às ${formatado.lembreteHora}`
        : 'N/A';

      return `
    <p><strong class="text-pink-500">${formatado.icone} ${formatado.comodo} (${formatado.titulo})</strong></p>
    <p>🧽 <strong>Descrição:</strong> ${formatado.descricao}</p>
    <p>🔁 Frequência: ${formatado.frequencia}</p>
    <p>📅 Data: ${formatado.data}</p>
    <p>⏰ Horário: ${formatado.hora}</p>
    <p>🔔 Lembrete: ${lembrete}</p>
  `.trim();
    }

    case 'cronograma': {
      const partes = [];
      if (item.descricao) partes.push(item.descricao);
      if (item.etapa) partes.push(item.etapa);
      if (item.horario) partes.push(item.horario);

      const detalhes = partes.length > 0 ? partes.join(' — ') : 'Sem detalhes';

      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Cronograma)</span></p>
<p><span class="text-pink-500">Detalhes:</span> ${detalhes}</p>
<p><span class="text-pink-500">📅 Data:</span> ${formatado.data}</p>
<p><span class="text-pink-500">🔄 Recorrência:</span> ${formatado.recorrencia}</p>
<p><span class="text-pink-500">📆 Dias da Semana:</span> ${formatado.diasSemana}</p>
<p><span class="text-pink-500">⏰ Alarme:</span> ${formatado.alarme}</p>
  `.trim();
    }


    case 'cardapio':
      return `
<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(Cardápio)</span></p>
<p><span class="text-pink-500">📆 Dias da Semana:</span> ${formatado.diasSemana}</p>
<p><span class="text-pink-500">☕ Café:</span> ${formatado.cafe || 'N/A'}</p>
<p><span class="text-pink-500">🍽️ Almoço:</span> ${formatado.almoco || 'N/A'}</p>
<p><span class="text-pink-500">🍪 Lanche:</span> ${formatado.lanche || 'N/A'}</p>
<p><span class="text-pink-500">🍲 Jantar:</span> ${formatado.jantar || 'N/A'}</p>
<p><span class="text-pink-500">🔁 Recorrência:</span> ${formatado.recorrencia}</p>
`.trim();

    default:
      const tipoFormatado = tipoItem.charAt(0).toUpperCase() + tipoItem.slice(1);
      return `<p><strong class="text-pink-500">${formatado.titulo}</strong> <span class="italic">(${tipoFormatado})</span></p>`;
  }
}