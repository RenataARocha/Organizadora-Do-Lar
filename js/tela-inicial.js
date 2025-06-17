document.addEventListener('DOMContentLoaded', function () {
  // 🌼 Frase do dia
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
    "Se cansar, respira. Mas não desiste, tá? 🚶‍♀️💪"
  ];

  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  const elementoFrase = document.getElementById("frase-do-dia");
  if (elementoFrase) {
    elementoFrase.textContent = fraseAleatoria;
  }

  // 🧠 Alternância entre seções (abre/fecha ao clicar)
  const botoes = document.querySelectorAll('.menu-principal .btn');
  const telas = document.querySelectorAll('.tela-oculta');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const telaId = botao.getAttribute('data-tela');
      const tela = document.getElementById(telaId);

      if (tela.classList.contains('hidden')) {
        // Fecha todas e abre a clicada
        telas.forEach(t => t.classList.add('hidden'));
        tela.classList.remove('hidden');
      } else {
        // Fecha a clicada se já estiver aberta
        tela.classList.add('hidden');
      }
    });
  });

  // 🔐 Botão de sair (logout)
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }

  // 📅 Calendário com Pikaday
  const datepicker = document.getElementById('datepicker');
  const picker = new Pikaday({
    field: datepicker,
    format: 'DD/MM/YYYY',
    i18n: {
      previousMonth: 'Anterior',
      nextMonth: 'Próximo',
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    },
    onSelect: function() {
      mostrarTarefasData(formatarDataISO(this.getDate()));
    }
  });

  // Helper para formatar data para ISO yyyy-mm-dd
  function formatarDataISO(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Container e lista da agenda
  const listaAgendaContainer = document.getElementById('agenda-lista-container');
  const listaAgenda = document.getElementById('lista-agenda');

  // Função que carrega tarefas do localStorage para uma data e exibe na lista
  function mostrarTarefasData(dataISO) {
    // Pega tarefas salvas na chave 'tarefas-YYYY-MM-DD'
    const tarefasSalvas = JSON.parse(localStorage.getItem(`tarefas-${dataISO}`)) || [];

    if (tarefasSalvas.length > 0) {
      listaAgendaContainer.style.display = 'block'; // mostra a lista
      listaAgenda.innerHTML = ''; // limpa a lista antes

      tarefasSalvas.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = tarefa;
        li.className = 'p-2 border-b border-pink-200';
        listaAgenda.appendChild(li);
      });
    } else {
      listaAgendaContainer.style.display = 'none'; // esconde lista se vazio
      listaAgenda.innerHTML = '';
    }
  }

  // Começa mostrando as tarefas de hoje (por padrão)
  mostrarTarefasData(formatarDataISO(new Date()));

  // Eventos dos botões SPA (agenda, resumo, etc)
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const tela = botao.getAttribute('data-tela');
      telas.forEach(t => t.classList.add('hidden'));
      const telaSelecionada = document.getElementById(tela);
      if (telaSelecionada) telaSelecionada.classList.remove('hidden');

      // Mostrar lista só se for a agenda
      if (tela === 'agenda') {
        listaAgendaContainer.style.display = 'block';
      } else {
        listaAgendaContainer.style.display = 'none';
      }
    });
  });
});


const hojeISO = '2025-06-17'; // data no formato ISO
const minhasTarefas = [
  'Comprar arroz',
  'Lavar roupa',
  'Estudar JavaScript',
];
localStorage.setItem(`tarefas-${hojeISO}`, JSON.stringify(minhasTarefas));
