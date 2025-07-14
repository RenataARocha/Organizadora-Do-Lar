import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';

document.addEventListener('DOMContentLoaded', () => {
  initLembretes('cronogramaCapilarEtapas', 'lista-cronogramas', 'mensagem-vazia');

  const form = document.getElementById('form-cronograma');
  const listaEtapas = document.getElementById('lista-cronogramas');
  const mensagemVazia = document.getElementById('mensagem-vazia');

  const selectEtapa = document.getElementById('etapa-cronograma');
  const textareaObs = document.getElementById('observacao-etapa');
  const selectProduto = document.getElementById('tipo-produto');
  const inputData = document.getElementById('data-etapa');
  const selectRecorrencia = document.getElementById('consulta-recorrencia');
  const diasSemanaCheckboxes = document.querySelectorAll('input[name="dias-semana"]');
  const inputReminderDate = document.getElementById('data-lembrete');
  const inputReminderTime = document.getElementById('hora-lembrete');
  const inputAlarme = document.getElementById('consulta-alarme');

  const STORAGE_KEY = 'cronogramaCapilarEtapas';

  function carregarEtapas() {
    const etapasJSON = localStorage.getItem(STORAGE_KEY);
    return etapasJSON ? JSON.parse(etapasJSON) : [];
  }

  function salvarEtapas(etapas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(etapas));
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Converte array de dias para texto com primeira letra maiúscula e vírgula
  function diasParaTexto(dias) {
    if (!dias || dias.length === 0) return '-';
    return dias.map(d => capitalize(d)).join(', ');
  }

  function criarItemEtapa(etapa, index) {
    const li = document.createElement('li');
    li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

    li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all relative">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      <p>
        <span class="text-pink-500">🛠️ Etapa:</span> ${capitalize(etapa.etapa)} 
        <span class="text-pink-500 ml-4">📦 Produto:</span> ${capitalize(etapa.produto)}
      </p>

      ${etapa.observacoes ? `
        <p class="text-sm">
          <span class="text-pink-500">📝 Observações:</span> ${etapa.observacoes}
        </p>
      ` : ''}

      <p class="text-sm">
        <span class="text-pink-500">📅 Data:</span> ${etapa.data}
      </p>

      <p class="text-sm">
        <span class="text-pink-500">🔄 Recorrência:</span> ${capitalize(etapa.recorrencia || '-')}
      </p>

      <p class="text-sm">
        <span class="text-pink-500">📆 Dias da Semana:</span> ${diasParaTexto(etapa.diasSelecionados)}
      </p>

      ${(etapa.reminderDate || etapa.reminderTime) ? `
        <p class="text-sm">
          <span class="text-pink-500">🔔 Lembrete:</span> ${etapa.reminderDate || ''} ${etapa.reminderTime || ''}
        </p>
      ` : ''}

      <p class="text-sm">
        <span class="text-pink-500">⏰ Alarme:</span> ${etapa.alarme || '-'}
      </p>
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover etapa"
      type="button"
    >
      Remover
      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
        style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">
        &#xf004;
      </span>
    </button>
  </div>
`;

    return li;
  }

  function atualizarLista() {
    const etapas = carregarEtapas();

    listaEtapas.innerHTML = '';

    if (etapas.length === 0) {
      mensagemVazia.style.display = 'block';
      return;
    }

    mensagemVazia.style.display = 'none';

    etapas.forEach((etapa, index) => {
      const li = criarItemEtapa(etapa, index);
      listaEtapas.appendChild(li);
    });

    listaEtapas.querySelectorAll('button.btn-remover').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        removerEtapa(Number(idx));
      });
    });
  }

  function removerEtapa(index) {
    const etapas = carregarEtapas();
    etapas.splice(index, 1);
    salvarEtapas(etapas);
    atualizarLista();
  }

  // Controle dos checkboxes dias da semana de acordo com a recorrência
  function atualizarDiasSemana() {
    const valor = selectRecorrencia.value;

    if (valor === 'nenhuma') {
      diasSemanaCheckboxes.forEach(chk => {
        chk.checked = false;
        chk.disabled = true;
        chk.parentElement.classList.add('opacity-50', 'cursor-not-allowed');
      });
    } else {
      diasSemanaCheckboxes.forEach(chk => {
        chk.disabled = false;
        chk.parentElement.classList.remove('opacity-50', 'cursor-not-allowed');
      });
    }
  }


  selectRecorrencia.addEventListener('change', atualizarDiasSemana);
  atualizarDiasSemana(); // inicializa no carregamento

  form.addEventListener('submit', (e) => {
  e.preventDefault();

  const novaEtapa = {
    etapa: selectEtapa.value.trim(),
    observacoes: textareaObs.value.trim(),
    produto: selectProduto.value,
    data: inputData.value,
    recorrencia: selectRecorrencia.value,
    diasSelecionados: Array.from(diasSemanaCheckboxes).filter(chk => chk.checked).map(chk => chk.value),
    reminderDate: inputReminderDate.value,
    reminderTime: inputReminderTime.value,
    alarme: inputAlarme.value,
    title: `Etapa: ${selectEtapa.value.trim()}`
  };

  if (!novaEtapa.etapa) {
    alert('Por favor, selecione a etapa do cronograma.');
    return;
  }
  if (!novaEtapa.data) {
    alert('Por favor, selecione a data da etapa.');
    return;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Corrige a criação da data para evitar erro com timezone
  const partes = novaEtapa.data.split('-');
  const dataEtapa = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  dataEtapa.setHours(0, 0, 0, 0);

  if (dataEtapa < hoje) {
    alert('Data da etapa não pode ser anterior a hoje.');
    return;
  }

  // restante do código para salvar, resetar form, atualizar lista
  const etapas = carregarEtapas();
  etapas.push(novaEtapa);
  salvarEtapas(etapas);
  atualizarLista();

  form.reset();
  selectEtapa.selectedIndex = 0;
  selectProduto.selectedIndex = 0;
  selectRecorrencia.selectedIndex = 0;
  atualizarDiasSemana();
});


  atualizarLista();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
