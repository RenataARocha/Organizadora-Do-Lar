document.addEventListener('DOMContentLoaded', function () {
  // 🌼 Frase do dia (igual você já tem)
  const frases = [ /* suas frases aqui... */ ];
  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  const elementoFrase = document.getElementById("frase-do-dia");
  if (elementoFrase) elementoFrase.textContent = fraseAleatoria;

  // 🧠 Alternância entre seções (abre/fecha ao clicar)
  const botoes = document.querySelectorAll('.menu-principal .btn');
  const telas = document.querySelectorAll('.tela-oculta');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const telaId = botao.getAttribute('data-tela');
      const tela = document.getElementById(telaId);

      if (tela.classList.contains('hidden')) {
        telas.forEach(t => t.classList.add('hidden'));
        tela.classList.remove('hidden');
      } else {
        tela.classList.add('hidden');
      }
    });
  });

  // 🔐 Botão sair (logout)
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }

  // Elementos da agenda
  const listaAgendaDia = document.getElementById('lista-agenda-dia');
  const inputBusca = document.getElementById('busca-tarefa');
  const inputData = document.getElementById('filtro-data');

  // Função para formatar data para ISO yyyy-mm-dd (para usar nas chaves do localStorage)
  function formatarDataISO(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Função para carregar tarefas de uma data (do localStorage)
  function carregarTarefas(dataISO) {
    return JSON.parse(localStorage.getItem(`tarefas-${dataISO}`)) || [];
  }

  // Função para mostrar tarefas na lista, com ícone e filtro por texto
  function mostrarTarefas(tarefas, filtro = '') {
    listaAgendaDia.innerHTML = '';

    const tarefasFiltradas = tarefas.filter(tarefa =>
      tarefa.toLowerCase().includes(filtro.toLowerCase())
    );

    if (tarefasFiltradas.length === 0) {
      listaAgendaDia.innerHTML = '<li class="text-gray-500">Nenhuma tarefa encontrada.</li>';
      return;
    }

    tarefasFiltradas.forEach(tarefa => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 p-2 bg-pink-50 rounded shadow-sm';

      const icon = document.createElement('span');
      icon.className = 'text-pink-400 text-lg';
      icon.textContent = '🌸'; // ícone de florzinha

      const texto = document.createElement('span');
      texto.textContent = tarefa;

      li.appendChild(icon);
      li.appendChild(texto);
      listaAgendaDia.appendChild(li);
    });
  }

  // Data selecionada atualmente (inicia com hoje)
  let dataSelecionada = formatarDataISO(new Date());

  // Carrega e mostra tarefas da data selecionada, aplicando filtro de busca
  function atualizarLista() {
    const tarefas = carregarTarefas(dataSelecionada);
    const filtro = inputBusca.value.trim();
    mostrarTarefas(tarefas, filtro);
  }

  // Eventos dos inputs
  inputData.value = dataSelecionada; // coloca hoje no input date

  inputData.addEventListener('change', () => {
    if (inputData.value) {
      dataSelecionada = inputData.value;
      atualizarLista();
    }
  });

  inputBusca.addEventListener('input', () => {
    atualizarLista();
  });

  // Carrega as tarefas iniciais de hoje
  atualizarLista();

  // Você pode adicionar aqui o resto do seu código que já tem
});


  document.addEventListener("DOMContentLoaded", function () {
    new Pikaday({
      field: document.getElementById('datepicker'),
      format: 'DD/MM/YYYY',
      i18n: {
        previousMonth: 'Mês anterior',
        nextMonth: 'Próximo mês',
        months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        weekdays: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
        weekdaysShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
      },
      firstDay: 1,
    });
  });
