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
  const selectRecurrence = form['task-recurrence-type'];
  const diasSemanaInputs = form.querySelectorAll('input[name="dias-semana"]');

  let tarefas = [];

  // FUNÇÃO para ativar/desativar os checkboxes dos dias conforme a recorrência
  function ajustarDiasSemana() {
    const tipo = selectRecurrence.value;
    if (tipo === 'weekly' || tipo === 'custom' || tipo === 'daily') {
      diasSemanaInputs.forEach(input => input.disabled = false);
    } else {
      diasSemanaInputs.forEach(input => {
        input.checked = false;
        input.disabled = true;
      });
    }

  }

  // Chama no carregamento inicial
  ajustarDiasSemana();

  // Atualiza quando o usuário muda o tipo de recorrência
  selectRecurrence.addEventListener('change', ajustarDiasSemana);

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

      // Mostrar os dias da semana selecionados formatados
      const diasSelecionados = (tarefa.diasSemana && tarefa.diasSemana.length > 0)
        ? tarefa.diasSemana.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
        : 'Nenhum selecionado';

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-xl shadow bg-pink-50 hover:bg-rose-100 transition-all">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      <p><span class="text-pink-500">📌 Título:</span> ${tarefa.title}</p>
      <p><span class="text-pink-500">⚡ Prioridade:</span> [${tarefa.priority.toUpperCase()}] 
         <span class="ml-2 text-pink-500">🏷️ Tópico:</span> ${tarefa.topic}</p>
      <p><span class="text-pink-500">📝 Descrição:</span> ${tarefa.description || 'Sem descrição'}</p>
      <p><span class="text-pink-500">📅 Data:</span> ${tarefa.date || 'Não definida'}</p>
      <p><span class="text-pink-500">🔁 Recorrência:</span> ${tarefa.recurrence}</p>
      <p><span class="text-pink-500">📆 Dias da semana:</span> ${diasSelecionados}</p>
      <p><span class="text-pink-500">⏰ Alarme:</span> ${tarefa.alarm || 'Sem alarme'}</p>
    </div>

    <button 
      class="btn-remover relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden"
      data-index="${index}"
      title="Remover tarefa"
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

  // SUGESTÃO DE TAREFA ALEATÓRIA
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

  // AGENDA DO DIA — mostra tarefas da data atual
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

  // ENVIO DO FORMULÁRIO
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Pega dias selecionados no checkbox
    const diasSelecionados = Array.from(form.querySelectorAll('input[name="dias-semana"]:checked'))
      .map(input => input.value);

    const tarefa = {
      title: form['task-title'].value.trim(),
      description: form['task-description'].value.trim(),
      topic: form['task-topic'].value,
      priority: form['task-priority'].value,
      date: form['task-date'].value,
      recurrence: form['task-recurrence-type'].value,
      diasSemana: diasSelecionados,
      alarm: form['task-alarm'].value
    };

    if (!tarefa.title) {
      alert('Por favor, preencha o título da tarefa!');
      return;
    }

    await salvarTarefa(tarefa);
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    renderizarTarefas();
    mostrarAgendaDoDia();
    form.reset();
    ajustarDiasSemana(); // atualiza estado dos checkboxes depois do reset
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

  // INICIALIZAÇÃO: carrega tarefas, sugere tarefa e mostra agenda
  tarefas = await listarTarefas();
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  renderizarTarefas();
  mostrarSugestao();
  mostrarAgendaDoDia();
});
