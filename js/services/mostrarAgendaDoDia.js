import { getAllItems } from '../../js/services/getAllItems.js';
import { formatarTitulo } from '../formatar-exibicao.js';

// Função para garantir tipo limpo e consistente
function limparTipo(tipo) {
  if (!tipo) return 'tarefa';
  let tipoLimpo = tipo.toLowerCase();
  if (tipoLimpo.startsWith('conta-')) tipoLimpo = 'conta';
  if (tipoLimpo.startsWith('skincare-')) tipoLimpo = 'skincare';
  return tipoLimpo;
}

// Mapeamento de tipos para chaves do localStorage
const mapaChaves = {
  tarefa: 'tarefas',
  meta: 'metas',
  consulta: 'consultas',
  conta: 'contas',
  remedio: 'remedios',
  limpeza: 'limpeza',
  skincare: 'skincare',
  cronograma: 'cronograma',
  cronogramaCapilarEtapas: 'cronogramaCapilarEtapas'
};

// Função para filtrar e formatar itens da agenda do dia
export function mostrarAgendaDoDia(dataReferencia = new Date()) {
  const hoje = dataReferencia.toISOString().split('T')[0];
  const todosItens = getAllItems();

  const itensDeHoje = todosItens.filter(item => item.data === hoje || item.prazo === hoje);

  itensDeHoje.sort((a, b) => {
    const horaA = a.hora || a.lembreteHora || '';
    const horaB = b.hora || b.lembreteHora || '';
    return horaA.localeCompare(horaB);
  });

  const itensFormatados = [];

  itensDeHoje.forEach(item => {
    const tipoLimpo = limparTipo(item.tipo);
    const tituloFormatado = formatarTitulo(item, tipoLimpo);

    if (tipoLimpo === 'remedio' && Array.isArray(item.raw?.horarios)) {
      item.raw.horarios.forEach(horario => {
        itensFormatados.push({
          texto: `${tituloFormatado} — ${horario}`,
          id: item.id,
          tipo: tipoLimpo,
          concluido: item.concluido || false
        });
      });
    } else {
      const horarioBase = item.hora || item.lembreteHora || '';
      let horario = horarioBase;
      if (tipoLimpo === 'conta' && !horarioBase && item.lembreteHora) {
        horario = item.lembreteHora;
      }
      const horarioFormatado = horario ? ` — ${horario}` : '';
      itensFormatados.push({
        texto: `${tituloFormatado}${horarioFormatado}`,
        id: item.id,
        tipo: tipoLimpo,
        concluido: item.concluido || false
      });
    }
  });

  return itensFormatados;
}

// Função para atualizar a interface da agenda do dia
export function atualizarAgendaDoDia(dataReferencia) {
  const listaAgenda = document.getElementById('lista-agenda-dia');
  if (!listaAgenda) return;

  const itens = mostrarAgendaDoDia(new Date(dataReferencia));
  listaAgenda.innerHTML = '';

  if (itens.length === 0) {
    listaAgenda.innerHTML = '<li class="text-gray-500">Nenhum item para hoje.</li>';
    return;
  }

  itens.forEach(itemObj => {
    console.log(`Renderizando item: id=${itemObj.id}, tipo=${itemObj.tipo}, texto=${itemObj.texto}`); // Depuração
    const li = document.createElement('li');
    li.className = 'mb-2 text-pink-800 flex items-center gap-2';

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'cursor-pointer';
    checkbox.checked = itemObj.concluido;
    li.classList.toggle('line-through', checkbox.checked);

    checkbox.addEventListener('change', () => {
      li.classList.toggle('line-through', checkbox.checked);
      const chaveLocalStorage = mapaChaves[itemObj.tipo];
      if (chaveLocalStorage) {
        const itens = JSON.parse(localStorage.getItem(chaveLocalStorage) || '[]');
        const item = itens.find(i => String(i.id) === String(itemObj.id));
        if (item) {
          item.concluido = checkbox.checked;
          localStorage.setItem(chaveLocalStorage, JSON.stringify(itens));
          console.log(`Checkbox atualizado: id=${itemObj.id}, tipo=${itemObj.tipo}, concluido=${checkbox.checked}`);
        }
      }
    });

    // Texto
    const spanTexto = document.createElement('span');
    spanTexto.textContent = itemObj.texto;

    // Botão lixeira
    const botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '🗑️';
    botaoExcluir.className = 'ml-auto cursor-pointer';
    botaoExcluir.addEventListener('click', () => {
      if (confirm('Deseja realmente excluir este item?')) {
        removerItem(itemObj.id, itemObj.tipo, dataReferencia);
      }
    });

    li.appendChild(checkbox);
    li.appendChild(spanTexto);
    li.appendChild(botaoExcluir);

    listaAgenda.appendChild(li);
  });
}

// Função para remover um item do localStorage
function removerItem(id, tipo, dataReferencia) {
  const chaveLocalStorage = mapaChaves[tipo];
  if (!chaveLocalStorage) {
    console.error(`Erro: Tipo inválido '${tipo}'`);
    return;
  }

  console.log(`Iniciando remoção: id=${id}, tipo=${tipo}, chave=${chaveLocalStorage}`);

  // Obter itens do localStorage
  let itens = JSON.parse(localStorage.getItem(chaveLocalStorage) || '[]');
  console.log(`Itens antes da remoção (${chaveLocalStorage}):`, itens);

  // Garantir que o id seja uma string para comparação
  const idString = String(id);
  const itemOriginal = itens.find(i => String(i.id) === idString);

  if (!itemOriginal) {
    console.error(`Erro: Item com id=${idString} não encontrado em ${chaveLocalStorage}`);
    return;
  }

  // Filtrar o item
  itens = itens.filter(i => String(i.id) !== idString);
  console.log(`Itens após filtragem (${chaveLocalStorage}):`, itens);

  // Salvar no localStorage
  try {
    localStorage.setItem(chaveLocalStorage, JSON.stringify(itens));
    console.log(`localStorage atualizado para ${chaveLocalStorage}:`, JSON.parse(localStorage.getItem(chaveLocalStorage)));
  } catch (error) {
    console.error(`Erro ao salvar no localStorage para ${chaveLocalStorage}:`, error);
    return;
  }

  // Atualizar a interface
  const hoje = new Date(dataReferencia);
  const dataFormatada = hoje.toISOString().split('T')[0];
  console.log(`Atualizando agenda para data: ${dataFormatada}`);
  atualizarAgendaDoDia(dataFormatada);
}