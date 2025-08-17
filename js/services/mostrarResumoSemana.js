import { getAllItems } from './getAllItems.js';
import { formatarTitulo } from '../formatar-exibicao.js';

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

export function mostrarResumoSemana(dataReferencia = new Date()) {
  const todosItens = getAllItems();
  const inicioSemana = new Date(dataReferencia);
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay()); // domingo
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 6); // sábado

  const itensDaSemana = todosItens.filter(item => {
    const dataItem = new Date(item.data || item.prazo);
    return dataItem >= inicioSemana && dataItem <= fimSemana;
  });

  const resumoPorDia = {};
  itensDaSemana.forEach(item => {
    const dataItem = new Date(item.data || item.prazo);
    const diaChave = dataItem.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    if (!resumoPorDia[diaChave]) resumoPorDia[diaChave] = [];

    if (item.tipo === 'remedio' && Array.isArray(item.raw?.horarios)) {
      // cria uma entrada pra cada horário do remédio
      item.raw.horarios.forEach(horario => {
        resumoPorDia[diaChave].push({
          ...item,
          texto: `${formatarTitulo(item, item.tipo)} — ${horario}`
        });
      });
    } else {
      resumoPorDia[diaChave].push({
        ...item,
        texto: `${formatarTitulo(item, item.tipo)}${item.hora ? ' — ' + item.hora : ''}`
      });
    }
  });

  return resumoPorDia;
}

export function atualizarResumoSemana(dataReferencia) {
  const listaResumo = document.getElementById('lista-resumo-semana');
  if (!listaResumo) return;

  const resumoPorDia = mostrarResumoSemana(new Date(dataReferencia));

  // Título fixo "Resumo da Semana"
  listaResumo.innerHTML = `
    <h2 class="text-2xl font-semibold mb-4 font-['Dancing_Script']">Resumo da Semana</h2>
    <p class="text-black mb-4">Aqui você vê um resumo das suas atividades da semana.</p>
  `;

  if (Object.keys(resumoPorDia).length === 0) {
    listaResumo.innerHTML += '<p class="text-gray-500">Nenhuma atividade nesta semana.</p>';
    return;
  }

  const container = document.createElement('div');

  // Converte o objeto em array e ordena os dias
  const diasOrdenados = Object.entries(resumoPorDia).sort(([diaA], [diaB]) => {
    const dataA = new Date(diaA.split(', ')[1].split('/').reverse().join('-'));
    const dataB = new Date(diaB.split(', ')[1].split('/').reverse().join('-'));
    return dataA - dataB;
  });

  diasOrdenados.forEach(([dia, itens]) => {
    const diaContainer = document.createElement('div');
    diaContainer.className = 'mb-4';

    const tituloDia = document.createElement('h3');
    tituloDia.className = 'font-medium text-stone-900 mb-1';
    tituloDia.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
    diaContainer.appendChild(tituloDia);

    const ul = document.createElement('ul');
    ul.className = 'space-y-1';

    // Ordena os itens pelo horário (se tiver)
    itens.sort((a, b) => {
      const horaA = a.texto.match(/(\d{2}:\d{2})/);
      const horaB = b.texto.match(/(\d{2}:\d{2})/);
      if (horaA && horaB) {
        return horaA[0].localeCompare(horaB[0]);
      } else if (horaA) {
        return -1; // quem tem hora vem antes
      } else if (horaB) {
        return 1;
      }
      return 0;
    });

    itens.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 mb-1';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.concluido || false;
      checkbox.addEventListener('change', () => {
        const chaveLocalStorage = mapaChaves[item.tipo];
        if (chaveLocalStorage) {
          const itens = JSON.parse(localStorage.getItem(chaveLocalStorage) || '[]');
          const itemLocal = itens.find(i => String(i.id) === String(item.id));
          if (itemLocal) {
            itemLocal.concluido = checkbox.checked;
            localStorage.setItem(chaveLocalStorage, JSON.stringify(itens));
          }
        }
      });

      const span = document.createElement('span');
      span.textContent = item.texto;

      li.appendChild(checkbox);
      li.appendChild(span);
      ul.appendChild(li);
    });

    diaContainer.appendChild(ul);
    container.appendChild(diaContainer);
  });

  listaResumo.appendChild(container);
}
