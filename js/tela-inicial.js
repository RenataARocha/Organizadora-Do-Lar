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

  // 🗂️ Carrega todas as tarefas/eventos de todas as categorias
  function carregarTarefas() {
    const prefixos = ['tarefas', 'contas', 'remedios', 'consultas', 'compras', 'cardapio', 'financas', 'limpeza', 'skincare', 'cronograma'];
    const chaves = Object.keys(localStorage).filter(k =>
      prefixos.some(prefix => k === prefix || k.startsWith(prefix + '-'))
    );

    let todasTarefas = [];
    chaves.forEach(chave => {
      try {
        const itens = JSON.parse(localStorage.getItem(chave)) || [];
        if (Array.isArray(itens)) {
          todasTarefas = todasTarefas.concat(itens);
        }
      } catch {
        // Ignora JSON inválido
      }
    });
    return todasTarefas;
  }

  function destacarDiasComTarefas() {
    const tarefas = carregarTarefas();
    const datas = {};

    tarefas.forEach(t => {
      if (t.date) {
        if (!datas[t.date]) datas[t.date] = [];
        datas[t.date].push(t.title || 'Evento');
      }
    });

    document.querySelectorAll('.pika-single td').forEach(td => {
      const ano = td.getAttribute('data-pika-year');
      const mes = td.getAttribute('data-pika-month');
      const dia = td.getAttribute('data-pika-day');

      if (ano && mes && dia) {
        const dataISO = `${ano}-${String(+mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        if (datas[dataISO]) {
          td.classList.add('relative', 'group');

          const bolinha = document.createElement('div');
          bolinha.className = 'absolute bottom-1 right-1 w-2 h-2 bg-pink-500 rounded-full';

          const tooltip = document.createElement('div');
          tooltip.textContent = datas[dataISO].join(', ');
          tooltip.className = `
            absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1
            bg-pink-600 text-white text-xs rounded-lg shadow-md
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none whitespace-nowrap
          `.trim();

          td.appendChild(bolinha);
          td.appendChild(tooltip);

          td.classList.add('bg-pink-200', 'rounded-full', 'text-black', 'font-semibold');
        }
      }
    });
  }

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

  const listaAgenda = document.getElementById('lista-agenda-dia');
  const datepickerInput = document.getElementById('datepicker');

  function atualizarLista() {
    const data = datepickerInput.value;
    const tarefas = carregarTarefas().filter(t => t.date === data);

    listaAgenda.innerHTML = '';
    if (tarefas.length === 0) {
      listaAgenda.innerHTML = '<li class="text-gray-500">Nenhuma tarefa encontrada.</li>';
    } else {
      tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-pink-50 p-2 rounded shadow mb-2';

        const span = document.createElement('span');
        span.textContent = tarefa.title;

        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-trash text-red-500"></i>';
        btn.addEventListener('click', () => {
          const prefixos = ['tarefas', 'contas', 'remedios', 'consultas', 'compras', 'cardapio', 'financas', 'limpeza', 'skincare', 'cronograma'];

          prefixos.forEach(prefixo => {
            let itens = JSON.parse(localStorage.getItem(prefixo)) || [];
            let novaLista = itens.filter(t => !(t.date === tarefa.date && t.title === tarefa.title));
            if (novaLista.length !== itens.length) {
              localStorage.setItem(prefixo, JSON.stringify(novaLista));
            }

            Object.keys(localStorage).forEach(chave => {
              if (chave.startsWith(prefixo + '-')) {
                let itensData = JSON.parse(localStorage.getItem(chave)) || [];
                let novaListaData = itensData.filter(t => !(t.date === tarefa.date && t.title === tarefa.title));
                if (novaListaData.length !== itensData.length) {
                  localStorage.setItem(chave, JSON.stringify(novaListaData));
                }
              }
            });
          });

          atualizarLista();
          destacarDiasComTarefas();
          estilizarCalendario();
        });

        li.appendChild(span);
        li.appendChild(btn);
        listaAgenda.appendChild(li);
      });
    }
  }

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

  // 📅 Pikaday
  const calendario = new Pikaday({
    field: datepickerInput,
    format: 'YYYY-MM-DD',
    i18n: {
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    },
    firstDay: 1,
    onDraw: () => setTimeout(() => {
      destacarDiasComTarefas();
      estilizarCalendario();
    }, 10),
    onSelect: () => atualizarLista()
  });

  // ⏰ Inicializa o dia atual
  const hoje = new Date();
  const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  datepickerInput.value = hojeFormatado;
  atualizarLista();

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
