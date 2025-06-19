// Pegando os elementos
const form = document.getElementById('form-task');
const listaTarefas = document.getElementById('lista-tarefas');
const mensagemVazia = document.getElementById('mensagemVazia');
const sugestaoTarefa = document.getElementById('sugestao-tarefa');

let tarefas = [];

// Função para salvar tarefas no localStorage
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função para carregar tarefas do localStorage
function carregarTarefas() {
  const dados = localStorage.getItem('tarefas');
  if (dados) {
    tarefas = JSON.parse(dados);
  }
}

// Função para criar o HTML da tarefa e adicionar na lista
function renderizarTarefas() {
  listaTarefas.innerHTML = ''; // limpa a lista

   if (tarefas.length === 0) {
    mensagemVazia.classList.remove('hidden');
    return;
  } else {
    mensagemVazia.classList.add('hidden');
  }

  tarefas.forEach((tarefa, index) => {
  const li = document.createElement('li');
  li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

  li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
    <div class="flex-1 space-y-1">
      <p class="text-base font-semibold">
        <span class="text-pink-500">Título:</span>
        <span class="text-black">${tarefa.title}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Prioridade:</span>
        <span class="text-black">[${tarefa.priority.toUpperCase()}]</span>
        <span class="text-pink-500 ml-2">Tópico:</span>
        <span class="text-black">${tarefa.topic}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Descrição:</span>
        <span class="text-black">${tarefa.description || 'Sem descrição'}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Data:</span>
        <span class="text-black">${tarefa.date || 'Não definida'}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Recorrência:</span>
        <span class="text-black">${tarefa.recurrence}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">⏰ Alarme:</span>
        <span class="text-black">${tarefa.alarm || 'Sem alarme'}</span>
      </p>
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover tarefa"
    >
      Remover
      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
        style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">
        &#xf004;
      </span>
    </button>
  </div>
`;

  listaTarefas.appendChild(li);
  });

  // Adiciona evento nos botões remover
  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      tarefas.splice(idx, 1);
      salvarTarefas();
      renderizarTarefas();
    });
  });
}

// Função para mostrar sugestão aleatória
function mostrarSugestao() {
  const sugestoes = [
    'Lavar a louça',
    'Estudar JavaScript por 30 minutos',
    'Organizar o armário',
    'Fazer uma caminhada rápida',
    'Ler um capítulo do livro',
    'Limpar a mesa de trabalho',
    'Responder e-mails pendentes',
    'Planejar o cardápio da semana',
    'Fazer uma pausa para alongar',
    'Anotar 3 coisas pelas quais você é grata',
    'Organizar os arquivos do computador',
    'Ouvir uma música que te inspire',
    'Preparar uma receita nova',
    'Revisar suas metas da semana',
    'Meditar por 5 minutos',
    'Enviar uma mensagem para alguém querido',
    'Separar roupas para doação',
    'Fazer um planejamento financeiro rápido',
    'Escrever no diário ou planner',
    'Limpar notificações do celular'
  ];

  const indice = Math.floor(Math.random() * sugestoes.length);
  sugestaoTarefa.textContent = sugestoes[indice];
}

// Evento do submit do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Pega os valores dos inputs
  const title = form['task-title'].value.trim();
  const description = form['task-description'].value.trim();
  const topic = form['task-topic'].value;
  const priority = form['task-priority'].value;
  const date = form['task-date'].value;
  const recurrence = form['task-recurrence'].value;
  const alarm = form['task-alarm'].value;

  if (!title) {
    alert('Por favor, preencha o título da tarefa!');
    return;
  }

  // Cria objeto da tarefa
  const tarefa = {
    title,
    description,
    topic,
    priority,
    date,
    recurrence,
    alarm
  };

  // Adiciona na lista e salva
  tarefas.push(tarefa);
  salvarTarefas();
  renderizarTarefas();

  // Reseta o formulário
  form.reset();
});

// Inicializa
carregarTarefas();
renderizarTarefas();
mostrarSugestao();

// ... seu código que você já tem aqui (form, renderizarTarefas, etc.)

// Função para mostrar tarefas do dia na agenda
function mostrarAgendaDoDia() {
  const listaAgenda = document.getElementById("lista-agenda");
  if (!listaAgenda) return;

  const hoje = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const tarefasHoje = tarefas.filter(t => t.date === hoje);

  listaAgenda.innerHTML = "";

  if (tarefasHoje.length === 0) {
    listaAgenda.innerHTML = "<p>🎈 Nada marcado para hoje!</p>";
  } else {
    tarefasHoje.forEach(tarefa => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${tarefa.title}</strong> - ${tarefa.description || ''} às ${tarefa.alarm || 'sem horário'}`;
      listaAgenda.appendChild(li);
    });
  }
}

// Chama logo que carrega as tarefas para mostrar agenda
mostrarAgendaDoDia();

// Variável para controlar alarme disparado (não repetir no mesmo minuto)
let alarmesDisparados = new Set();

// Função para verificar alarme a cada minuto
function verificarAlarme() {
  const agora = new Date();
  const hoje = agora.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const horaMinuto = agora.toTimeString().slice(0, 5); // 'HH:MM'

  tarefas.forEach(tarefa => {
    const idAlarme = tarefa.title + tarefa.date + tarefa.alarm;

    if (tarefa.date === hoje && tarefa.alarm === horaMinuto && !alarmesDisparados.has(idAlarme)) {
      alert(`⏰ Alarme: ${tarefa.title}`);
      alarmesDisparados.add(idAlarme);
      // Se quiser som, basta adicionar aqui:
      // new Audio('alarme.mp3').play();
    }
  });
}

// Verifica alarme a cada minuto
setInterval(verificarAlarme, 60000);

// Botão sair
const btnSair = document.getElementById("btn-sair");
if (btnSair) {
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
  });
}
