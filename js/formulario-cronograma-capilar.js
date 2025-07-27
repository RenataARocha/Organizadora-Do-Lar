import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener('DOMContentLoaded', () => {
  initLembretes('cronogramaCapilarEtapas', 'lista-cronogramas', 'mensagem-vazia');

  const dicaCapilar = document.getElementById('dica-capilar');
  const dicasCapilares = [
    "Hidrate os fios semanalmente para manter o brilho.",
    "Evite usar água muito quente para lavar o cabelo.",
    "Faça umectação com óleo vegetal para nutrição profunda.",
    "Use protetor térmico antes de secar ou pranchar os fios.",
    "Corte as pontas a cada 3 meses para evitar pontas duplas.",
    "Lave o cabelo massageando suavemente o couro cabeludo.",
    "Evite prender os cabelos molhados para não quebrar os fios.",
    "Inclua máscaras de reconstrução se o cabelo estiver fraco.",
    "Enxágue com água fria para selar as cutículas.",
    "Evite lavar o cabelo todos os dias para não ressecar.",
    "Use shampoo sem sulfato se seu cabelo for cacheado ou seco.",
    "Proteja os fios do sol usando chapéus ou leave-in com UV.",
    "Não exagere no uso de químicas para evitar danos graves.",
    "Faça cronograma capilar: hidratação, nutrição e reconstrução.",
    "Alimente-se bem: cabelos saudáveis começam de dentro para fora!"
  ];

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

  function diasParaTexto(dias) {
    if (!dias || dias.length === 0) return '-';
    return dias.map(d => capitalize(d)).join(', ');
  }

  function criarItemEtapa(etapa, index) {
    const li = document.createElement('li');
    li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

    const icone = obterIconeCategoria(etapa.etapa || 'etapa');

    li.innerHTML = `
      <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all relative">
        <div class="flex-1 space-y-2 text-base font-semibold text-black">
          ${formatarExibicao({
      ...etapa,
      titulo: `${icone} ${capitalize(etapa.etapa)}`,
      produtoFormatado: capitalize(etapa.produto),
      diasTexto: diasParaTexto(etapa.diasSelecionados),
      recorrenciaFormatada: capitalize(etapa.recorrencia || '-')
    }, 'produto')}
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

  // Função para adicionar recorrência
  function adicionarTempo(dataStr, recorrencia) {
    const data = new Date(dataStr);
    switch (recorrencia.toLowerCase()) {
      case 'diária': data.setDate(data.getDate() + 1); break;
      case 'semanal': data.setDate(data.getDate() + 7); break;
      case 'quinzenal': data.setDate(data.getDate() + 15); break;
      case 'mensal': data.setMonth(data.getMonth() + 1); break;
      case 'anual': data.setFullYear(data.getFullYear() + 1); break;
      default: break;
    }
    return data.toISOString().slice(0, 10);
  }

  // Atualiza as datas das etapas recorrentes
  function atualizarRecorrencias() {
    const etapas = carregarEtapas();
    const hoje = new Date().toISOString().slice(0, 10);
    let alterou = false;

    etapas.forEach(etapa => {
      if (etapa.recorrencia && etapa.recorrencia.toLowerCase() !== 'nenhuma') {
        if (etapa.data <= hoje) {
          etapa.data = adicionarTempo(etapa.data, etapa.recorrencia);
          if (etapa.lembreteData && etapa.lembreteData <= hoje) {
            etapa.lembreteData = adicionarTempo(etapa.lembreteData, etapa.recorrencia);
          }
          alterou = true;
        }
      }
    });

    if (alterou) salvarEtapas(etapas);
  }

  // Controle de dias da semana
  function atualizarDiasSemana() {
    const valor = selectRecorrencia.value;
    if (valor.toLowerCase() === 'nenhuma') {
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

  function mostrarDicaCapilar() {
    const random = Math.floor(Math.random() * dicasCapilares.length);
    dicaCapilar.textContent = dicasCapilares[random];
  }

  selectRecorrencia.addEventListener('change', atualizarDiasSemana);
  atualizarDiasSemana();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaEtapa = {
      etapa: selectEtapa.value.trim(),
      observacoes: textareaObs.value.trim(),
      produto: selectProduto.value,
      data: inputData.value,
      recorrencia: selectRecorrencia.value,
      diasSelecionados: Array.from(diasSemanaCheckboxes).filter(chk => chk.checked).map(chk => chk.value),
      lembreteData: inputReminderDate.value,
      lembreteHora: inputReminderTime.value,
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

  atualizarRecorrencias();
  mostrarDicaCapilar();
  atualizarLista();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
