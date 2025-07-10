document.addEventListener('DOMContentLoaded', function () {
  // 🌼 Frase do dia (com provérbios e mensagens de encorajamento)
  const frases = [
    "Você é mais forte do que imagina 🌸",
    "Cada dia é uma nova chance de recomeçar ☀️",
    "Seja gentil consigo mesma 💕",
    "Organizar o dia é o primeiro passo pra conquistar seus sonhos ✨",
    "Pequenos passos também são progresso 🚶‍♀️",
    "Você dá conta, sim! 🌷",
    "Respira fundo… um passo de cada vez, você vai longe 🌿",
    "Seu esforço de hoje é o brilho de amanhã 💫",
    "Não precisa ser perfeito, só precisa ser feito 🧸",
    "Você está exatamente onde precisa estar para começar 🌈",
    "Até os dias nublados preparam lindos recomeços ☁️✨",
    "Confia no processo, você está crescendo mesmo sem perceber 🌱",
    "Cuide de você como cuida de quem ama 🧡",
    "Hoje é um ótimo dia pra se orgulhar do que você já conquistou 🌷",
    "Você já passou por tanta coisa… e segue firme! Isso é força 🦋",
    "Se cansar, respira. Mas não desiste, tá? 🚶‍♀️💪",

    // 🌟 Provérbios e reflexões
    "A alegria do coração transparece no rosto. (Provérbios 15:13) 😊",
    "A resposta branda desvia o furor. (Provérbios 15:1) 🌸",
    "Tudo tem o seu tempo determinado. (Eclesiastes 3:1) ⏳",
    "O coração alegre é bom remédio. (Provérbios 17:22) 💖",
    "Não se preocupe com amanhã, pois ele trará seus próprios cuidados. (Mateus 6:34) 🌅",
    "O Senhor é meu pastor, nada me faltará. (Salmo 23:1) 🐑",
    "Ela é forte e digna, e sorri sem medo do futuro. (Provérbios 31:25) 💪",
    "Nem olhos viram, nem ouvidos ouviram o que Deus preparou para você. (1 Coríntios 2:9) ✨",
    "Não temas, pois estou contigo. (Isaías 41:10) 🕊️",
    "Tudo posso naquele que me fortalece. (Filipenses 4:13) 💥",
    "Se Deus é por nós, quem será contra nós? (Romanos 8:31) ⚔️",
    "O amor é paciente, o amor é bondoso. (1 Coríntios 13:4) 💞"
  ];

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
    base = "./";
  } else {
    base = "./";
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
