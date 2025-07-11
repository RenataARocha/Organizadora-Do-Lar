import { voltarParaHome } from './funcoes-globais.js';
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona os elementos do DOM
  const form = document.getElementById('form-cronograma');
  const listaEtapas = document.getElementById('lista-cronogramas');
  const mensagemVazia = document.getElementById('mensagem-vazia');

  const selectEtapa = document.getElementById('etapa-cronograma');
  const textareaObs = document.getElementById('observacao-etapa');
  const selectProduto = document.getElementById('tipo-produto');
  const inputData = document.getElementById('data-etapa');
  const inputReminderDate = document.getElementById('data-lembrete');
  const inputReminderTime = document.getElementById('hora-lembrete');

  const STORAGE_KEY = 'cronogramaCapilarEtapas';

  // Carregar etapas do localStorage
  function carregarEtapas() {
    const etapasJSON = localStorage.getItem(STORAGE_KEY);
    return etapasJSON ? JSON.parse(etapasJSON) : [];
  }

  // Salvar etapas no localStorage
  function salvarEtapas(etapas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(etapas));
  }

  // Função utilitária para deixar a primeira letra maiúscula
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Criar o item da lista para cada etapa
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

      ${(etapa.reminderDate || etapa.reminderTime) ? `
        <p class="text-sm">
          <span class="text-pink-500">🔔 Lembrete:</span> ${etapa.reminderDate || ''} ${etapa.reminderTime || ''}
        </p>
      ` : ''}
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

  // Atualizar lista na tela
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

    // Evento para remover etapa
    listaEtapas.querySelectorAll('button.btn-remover').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        removerEtapa(Number(idx));
      });
    });
  }

  // Remove a etapa pelo índice
  function removerEtapa(index) {
    const etapas = carregarEtapas();
    etapas.splice(index, 1);
    salvarEtapas(etapas);
    atualizarLista();
  }

  // Evento submit do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaEtapa = {
      etapa: selectEtapa.value.trim(),
      observacoes: textareaObs.value.trim(),
      produto: selectProduto.value,
      data: inputData.value,
      reminderDate: inputReminderDate.value,
      reminderTime: inputReminderTime.value,
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
  });

  // Mostrar dica capilar aleatória
  const dicasCapilares = [
    "Lave o cabelo com água morna para evitar ressecamento.",
    "Use um shampoo adequado para o seu tipo de cabelo.",
    "Não lave o cabelo todos os dias para preservar a oleosidade natural.",
    "Aplique condicionador somente nas pontas para evitar raiz oleosa.",
    "Faça hidratação semanal para manter os fios saudáveis e brilhantes.",
    "Evite usar secador e chapinha em excesso para não danificar os fios.",
    "Proteja o cabelo do sol usando produtos com filtro UV.",
    "Penteie os cabelos com cuidado para evitar quebra.",
    "Corte as pontas regularmente para evitar pontas duplas.",
    "Alimente-se bem: uma dieta balanceada reflete na saúde capilar."
  ];

  function mostrarDicaCapilar() {
    const indiceAleatorio = Math.floor(Math.random() * dicasCapilares.length);
    const dicaSelecionada = dicasCapilares[indiceAleatorio];
    const elementoDica = document.getElementById('dica-capilar');
    if (elementoDica) {
      elementoDica.textContent = dicaSelecionada;
    }
  }

  // Chama as funções iniciais quando o DOM estiver pronto
  atualizarLista();
  mostrarDicaCapilar();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
