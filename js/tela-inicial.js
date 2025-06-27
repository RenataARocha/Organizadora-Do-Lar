document.addEventListener('DOMContentLoaded', function () {
  // 🌼 Frase do dia
  const frases = [/* suas frases aqui... */];
  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  const elementoFrase = document.getElementById("frase-do-dia");
  if (elementoFrase) elementoFrase.textContent = fraseAleatoria;

  // 🧠 Alternância entre seções
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

  // 🔐 Botão sair
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }

  // 📅 Pikaday (calendário)
  new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'DD/MM/YYYY',
    i18n: {
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    },
    firstDay: 1,
  });

  // 📋 Agenda do dia
  const listaAgendaDia = document.getElementById('lista-agenda-dia');
  const inputBusca = document.getElementById('busca-tarefa');
  const inputData = document.getElementById('filtro-data');

  function formatarDataISO(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  function carregarTarefas(dataISO) {
    return JSON.parse(localStorage.getItem(`tarefas-${dataISO}`)) || [];
  }

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
      icon.textContent = '🌸';

      const texto = document.createElement('span');
      texto.textContent = tarefa;

      li.appendChild(icon);
      li.appendChild(texto);
      listaAgendaDia.appendChild(li);
    });
  }

  let dataSelecionada = formatarDataISO(new Date());

  function atualizarLista() {
    const tarefas = carregarTarefas(dataSelecionada);
    const filtro = inputBusca.value.trim();
    mostrarTarefas(tarefas, filtro);
  }

  inputData.value = dataSelecionada;
  inputData.addEventListener('change', () => {
    if (inputData.value) {
      dataSelecionada = inputData.value;
      atualizarLista();
    }
  });

  inputBusca.addEventListener('input', () => {
    atualizarLista();
  });

  atualizarLista();

  // 🌐 LINKS DINÂMICOS para as abas
  let base = "";

  if (window.location.hostname.includes("github.io")) {
    base = "/Organizadora-Do-Lar/pages/";
  } else if (window.location.protocol === "file:") {
    base = "pages/"; // Executando no app Android com Capacitor
  } else {
    base = "pages/";
  }

  const links = {
    "link-tarefa": "formulario-tarefa.html",
    "link-meta": "formulario-meta.html",
    "link-consultas": "formulario-consultas.html",
    "link-contas": "formulario-contas.html",
    "link-compras": "formulario-lista-compras.html",
    "link-cardapio": "formulario-cardapio.html",
    "link-remedios": "formulario-remedios.html",
    "link-financas": "formulario-financas.html",
    "link-limpeza": "formulario-limpeza.html",
    "link-skincare": "formulario-skincare.html",
    "link-cronograma": "formulario-cronograma-capilar.html"
  };

  for (const id in links) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        window.location.href = base + links[id];
      });
    }
  }
});
