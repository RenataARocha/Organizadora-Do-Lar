import { abrirBanco, salvarTarefa, listarTarefas } from './banco.js';
import { voltarParaHome } from './funcoes-globais.js';

document.addEventListener('DOMContentLoaded', async () => {
  await abrirBanco();

  // ELEMENTOS
  const form = document.getElementById('form-task');
  const listaTarefas = document.getElementById('lista-tarefas');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const sugestaoTarefa = document.getElementById('sugestao-tarefa');
  const btnSair = document.getElementById("btn-sair");
  const botaoVoltar = document.getElementById('btn-voltar');
  const listaAgenda = document.getElementById("lista-agenda");

  let tarefas = [];

  // MOSTRAR TAREFAS NA TELA
  function renderizarTarefas() {
    listaTarefas.innerHTML = '';
    if (tarefas.length === 0) {
      mensagemVazia.style.display = 'block';
      return;
    }
    mensagemVazia.style.display = 'none';

    tarefas.forEach((tarefa, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      li.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
          <div class="flex-1 space-y-1">
            <p><span class="text-pink-500">Título:</span> ${tarefa.title}</p>
            <p><span class="text-pink-500">Prioridade:</span> [${tarefa.priority.toUpperCase()}] 
               <span class="ml-2 text-pink-500">Tópico:</span> ${tarefa.topic}</p>
            <p><span class="text-pink-500">Descrição:</span> ${tarefa.description || 'Sem descrição'}</p>
            <p><span class="text-pink-500">Data:</span> ${tarefa.date || 'Não definida'}</p>
            <p><span class="text-pink-500">Recorrência:</span> ${tarefa.recurrence}</p>
            <p><span class="text-pink-500">⏰ Alarme:</span> ${tarefa.alarm || 'Sem alarme'}</p>
          </div>
          <button class="btn-remover bg-pink-400 text-white py-2 px-4 rounded-lg hover:bg-pink-500 transition-all"
                  data-index="${index}" title="Remover tarefa">Remover</button>
        </div>
      `;
      listaTarefas.appendChild(li);
    });

    // REMOVER TAREFA
    document.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        tarefas.splice(idx, 1);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarTarefas();
        mostrarAgendaDoDia();
      });
    });
  }

  // SUGESTÃO
  function mostrarSugestao() {
    const sugestoes = [
      'Lavar a louça', 'Estudar JavaScript', 'Organizar o armário', 'Fazer caminhada',
      'Ler um livro', 'Limpar a mesa', 'Responder e-mails', 'Planejar cardápio',
      'Alongar-se', 'Agradecer por 3 coisas', 'Organizar arquivos', 'Ouvir música',
      'Tentar receita nova', 'Revisar metas', 'Meditar 5min', 'Mandar mensagem carinhosa',
      'Separar doações', 'Planejamento financeiro', 'Escrever no diário', 'Limpar notificações'
    ];
    const indice = Math.floor(Math.random() * sugestoes.length);
    sugestaoTarefa.textContent = sugestoes[indice];
  }

  // AGENDA DO DIA
  function mostrarAgendaDoDia() {
    if (!listaAgenda) return;

    const hoje = new Date().toISOString().split('T')[0];
    const tarefasHoje = tarefas.filter(t => t.date === hoje);

    listaAgenda.innerHTML = tarefasHoje.length === 0
      ? "<p>🎈 Nada marcado para hoje!</p>"
      : tarefasHoje.map(t =>
        `<li><strong>${t.title}</strong> - ${t.description || ''} às ${t.alarm || 'sem horário'}</li>`
      ).join('');
  }

  // VERIFICAR ALARMES
  let alarmesDisparados = new Set();
  function verificarAlarme() {
    const agora = new Date();
    const hoje = agora.toISOString().split('T')[0];
    const horaMinuto = agora.toTimeString().slice(0, 5);

    tarefas.forEach(tarefa => {
      const idAlarme = `${tarefa.title}-${tarefa.date}-${tarefa.alarm}`;
      if (
        tarefa.date === hoje &&
        tarefa.alarm === horaMinuto &&
        !alarmesDisparados.has(idAlarme)
      ) {
        alert(`⏰ Alarme: ${tarefa.title}`);
        alarmesDisparados.add(idAlarme);
      }

      alert(`⏰ Alarme: ${tarefa.title}`);
      tocarSom(); // 🔈 toca a musiquinha fofa

    });
  }
  setInterval(verificarAlarme, 60000);

  // FORMULÁRIO
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tarefa = {
      title: form['task-title'].value.trim(),
      description: form['task-description'].value.trim(),
      topic: form['task-topic'].value,
      priority: form['task-priority'].value,
      date: form['task-date'].value,
      recurrence: form['task-recurrence'].value,
      alarm: form['task-alarm'].value
    };

    if (!tarefa.title) {
      alert('Por favor, preencha o título da tarefa!');
      return;
    }

    await salvarTarefa(tarefa);
    tarefas.push(tarefa); // Adiciona na lista local
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Backup local
    renderizarTarefas();
    mostrarAgendaDoDia();
    form.reset();
  });

  // BOTÃO SAIR
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }

  // BOTÃO VOLTAR
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }

  // INICIALIZAÇÃO
  tarefas = await listarTarefas();
  localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Backup local
  renderizarTarefas();
  mostrarSugestao();
  mostrarAgendaDoDia();
});
