export function normalizarItem(item, tipo, storageKey = null) {
    let tituloFormatado = '';

    switch (tipo) {
        case 'conta':
            tituloFormatado = `💸 Conta: ${item.nome || item.titulo || 'Sem título'}`;
            break;
        case 'remedio':
            tituloFormatado = `💊 Remédio: ${item.titulo || item.nome || 'Sem título'}`;
            break;
        case 'meta':
            tituloFormatado = `🎯 Meta: ${item.titulo || 'Sem título'}`;
            break;
        case 'consulta':
            tituloFormatado = `🩺 Consulta: ${item.nome || item.titulo || 'Sem título'}`;
            break;
        case 'limpeza':
            tituloFormatado = `🧹 Limpeza: ${item.titulo || item.nome || 'Sem título'}`;
            break;
        case 'skincare':
            tituloFormatado = `✨ Skincare: ${item.titulo || item.nome || 'Sem título'}`;
            break;
        case 'cronograma':
            tituloFormatado = `📅 Cronograma: ${item.titulo || item.nome || 'Sem título'}`;
            break;
        case 'tarefa':
        default:
            tituloFormatado = item.titulo || item.title || item.nome || 'Sem título';
            break;
    }

    return {
        id: item.id || Date.now(),
        tipo,
        storageKey,
        titulo: tituloFormatado,
        data: item.data || item.date || item.vencimento || null,
        hora: item.hora || item.horario || item.inputHorarioConsulta || '',
        feito: item.feito || false,
        completedAt: item.completedAt || null,
        raw: item
    };
}
