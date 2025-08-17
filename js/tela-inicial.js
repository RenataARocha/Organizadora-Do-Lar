import { mostrarAgendaDoDia, atualizarAgendaDoDia } from './services/mostrarAgendaDoDia.js';
import { getAllItems } from './services/getAllItems.js';
import { atualizarResumoSemana } from './services/mostrarResumoSemana.js';

document.addEventListener('DOMContentLoaded', function () {
  mostrarAgendaDoDia();
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
    "Se cansar, respira. Mas não desiste, tá? 🚶‍♀️💪",
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
  const frase = frases[Math.floor(Math.random() * frases.length)];
  const elFrase = document.getElementById("frase-do-dia");
  if (elFrase) elFrase.textContent = frase;


  function estilizarCalendario() {
    document.querySelectorAll('.pika-single').forEach(cal => {
      cal.classList.add('bg-pink-100', 'rounded-xl', 'shadow-lg', 'font-sans');
    });

    document.querySelectorAll('.pika-single td.is-selected, .pika-single td.is-today').forEach(td => {
      td.classList.add('bg-pink-500', 'text-white', 'rounded-full');
    });

    document.querySelectorAll('.pika-single td.bg-pink-200').forEach(td => {
      td.classList.add('bg-pink-300', 'text-pink-900', 'font-semibold', 'rounded-full');
    });
  }

  document.querySelector('button[data-tela="resumo"]').addEventListener('click', () => {
    atualizarResumoSemana(new Date()); // data de hoje como referência
  });

  const datepickerInput = document.getElementById('calendario-inicial');

  // 🎯 Alternância entre telas
  const botoes = document.querySelectorAll('.menu-principal .btn');
  const telas = document.querySelectorAll('.tela-oculta');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const telaId = botao.getAttribute('data-tela');
      const tela = document.getElementById(telaId);
      if (!tela) return;

      if (!tela.classList.contains('hidden')) {
        tela.classList.add('hidden');
      } else {
        telas.forEach(t => t.classList.add('hidden'));
        tela.classList.remove('hidden');
      }
    });
  });

  // 🔐 Segurança
  // if (!localStorage.getItem("usuarioLogado")) {
  // alert("Você precisa estar logado para acessar essa página.");
  // window.location.href = "../index.html";
  // return;
  // }

  // 🔒 Sair
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }

  flatpickr("#calendario-inicial", {
    dateFormat: "Y-m-d",
    disableMobile: true,
    onChange: function (selectedDates, dateStr) {
      // Atualiza a agenda do dia
      atualizarAgendaDoDia(dateStr);

      // Abre a aba da agenda automaticamente
      const telaAgenda = document.getElementById("agenda");
      if (telaAgenda && telaAgenda.classList.contains("hidden")) {
        // Fecha outras telas
        document.querySelectorAll(".tela-oculta").forEach(t => t.classList.add("hidden"));
        // Abre a agenda
        telaAgenda.classList.remove("hidden");
      }
    },

    onDayCreate: (dObj, dStr, fp, dayElem) => {
      const dataFormatada = dayElem.dateObj.toISOString().split("T")[0];
      const existeTarefa = getAllItems().some(
        t => t.data === dataFormatada || t.prazo === dataFormatada
      );
      if (existeTarefa) {
        dayElem.classList.add("bg-pink-300", "rounded-full", "text-white", "font-bold");
      }
    }
  });
  estilizarCalendario();

  // ⏰ Inicializa o dia atual
  const hoje = new Date();
  const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  atualizarAgendaDoDia(hojeFormatado); // já com a data de hoje
  datepickerInput.value = hojeFormatado;



  // 🔗 Links para formulários
  const base = window.location.hostname.includes("github.io") ? "/Organizadora-Do-Lar/pages/" : "./";
  const links = {
    "link-tarefa": "formulario-tarefa.html",
    "link-meta": "formulario-meta.html",
    "link-consultas": "formulario-consultas.html",
    "link-contas": "formulario-contas.html",
    "link-compras": "formulario-lista-compras.html",
    "link-cardapio": "formulario-cardapio.html",
    "link-remedios": "formulario-remedios.html",
    "link-financas": "formulario-financas.html",
    "link-historico": "historico.html",
    "link-limpeza": "formulario-limpeza.html",
    "link-skincare": "formulario-skincare.html",
    "link-cronograma": "formulario-cronograma-capilar.html"
  };
  for (const id in links) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => window.location.href = base + links[id]);
    }
  }
});