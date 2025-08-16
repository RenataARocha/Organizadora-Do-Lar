import { abrirBanco, salvarTarefa, listarTarefas } from './banco.js';
import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

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

  // --- FUNÇÕES AUXILIARES ---
  function salvarLocal() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  function normalizarParaISO(str) {
    if (!str) return null;
    if (str.includes("/")) {
      const [d, m, y] = str.split("/").map(Number);
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return str;
  }

  function calcularProximaOcorrencia(dataBaseStr, periodicidade) {
    const baseISO = normalizarParaISO(dataBaseStr);
    const [ano, mes, dia] = baseISO.split("-").map(Number);
    const d = new Date(ano, mes - 1, dia);

    switch (periodicidade) {
      case "Diária": d.setDate(d.getDate() + 1); break;
      case "Semanal": d.setDate(d.getDate() + 7); break;
      case "Quinzenal": d.setDate(d.getDate() + 15); break;
      case "Mensal": d.setMonth(d.getMonth() + 1); break;
      case "Anual": d.setFullYear(d.getFullYear() + 1); break;
      default: return null;
    }

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function isPastOrToday(dateStrISO) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStrISO);
    d.setHours(0, 0, 0, 0);
    return d.getTime() <= today.getTime();
  }

  function processarRecorrencias() {
    let alterou = false;
    tarefas.forEach((t) => {
      if (!t.recorrencia || t.recorrencia === "Nenhuma") return;

      while (isPastOrToday(t.data)) {
        const novaData = calcularProximaOcorrencia(t.data, t.recorrencia);
        if (!novaData) break;
        t.data = novaData; 
        alterou = true;
      }
    });

    if (alterou) {
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
  }


  // --- AJUSTE DOS DIAS DA SEMANA ---
  function ajustarDiasSemana() {
    const tipoRecorrencia = selectRecurrence.value;
    const campoDiaDoMes = document.getElementById('campo-dia-do-mes');

    if (['Diária', 'Semanal', 'Quinzenal', 'Mensal'].includes(tipoRecorrencia)) {
      diasSemanaInputs.forEach(input => input.disabled = false);
    } else {
      diasSemanaInputs.forEach(input => {
        input.checked = false;
        input.disabled = true;
      });
    }

    if (tipoRecorrencia === 'monthly') {
      campoDiaDoMes?.classList.remove('hidden');
    } else {
      campoDiaDoMes?.classList.add('hidden');
    }
  }
  ajustarDiasSemana();
  selectRecurrence.addEventListener('change', ajustarDiasSemana);

  // --- LISTAR TAREFAS ---
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
    <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
      <div class="flex-1 space-y-2 text-base font-semibold text-black">
        ${formatarExibicao({ ...tarefa, categoria: tarefa.categoria || tarefa.topic || 'N/A' }, 'tarefa')}
      </div>
    </div>
  `;

  // Cria div para os botões, empilhando verticalmente
  const botoesDiv = document.createElement('div');
  botoesDiv.className = 'flex flex-col gap-1 mt-1';

  // Botão remover
  const botaoRemover = document.createElement('button');
  botaoRemover.className = 'relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden';
  botaoRemover.innerHTML = `Remover
    <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
      style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
    </span>`;
  botaoRemover.setAttribute('data-index', index);
  botaoRemover.addEventListener('click', (e) => {
    const idx = e.currentTarget.getAttribute('data-index');
    tarefas.splice(idx, 1);
    salvarLocal();
    renderizarTarefas();
    mostrarAgendaDoDia();
  });

  // Botão editar
  const botaoEditar = document.createElement('button');
  botaoEditar.className = 'relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden';
  botaoEditar.innerHTML = `Editar
    <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
      style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
    </span>`;
  botaoEditar.setAttribute('data-index', index);
  botaoEditar.addEventListener('click', () => {
    abrirFormularioComItem(tarefas[index]);
  });

  // Adiciona os botões na div
  botoesDiv.appendChild(botaoRemover);
  botoesDiv.appendChild(botaoEditar);

  // Adiciona a div de botões no li
  li.querySelector('div').appendChild(botoesDiv);

  listaTarefas.appendChild(li);
});


    // Mantém o evento de remover
    document.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        tarefas.splice(idx, 1);
        salvarLocal();
        renderizarTarefas();
        mostrarAgendaDoDia();
      });
    });
  }

  // --- AGENDA DO DIA ---
  function tarefaEhDoDia(tarefa, hoje) {
    const dataTarefa = new Date(tarefa.data);
    const tipoRecorrencia = tarefa.recorrencia;

    if (!tipoRecorrencia || tipoRecorrencia === "nenhuma") {
      return (
        dataTarefa.getDate() === hoje.getDate() &&
        dataTarefa.getMonth() === hoje.getMonth() &&
        dataTarefa.getFullYear() === hoje.getFullYear()
      );
    }

    switch (tipoRecorrencia) {
      case "diaria":
      case "daily":
        return true;
      case "semanal":
      case "weekly":
        return dataTarefa.getDay() === hoje.getDay();
      case "mensal":
      case "monthly":
        const ehMesmoDiaDoMes = dataTarefa.getDate() === hoje.getDate();
        const diasSelecionados = tarefa.diasSemana || [];
        return diasSelecionados.length > 0
          ? diasSelecionados.includes(hoje.getDay().toString())
          : ehMesmoDiaDoMes;
      case "anual":
      case "yearly":
        return (
          dataTarefa.getDate() === hoje.getDate() &&
          dataTarefa.getMonth() === hoje.getMonth()
        );
      default:
        return false;
    }
  }

  function mostrarAgendaDoDia() {
    if (!listaAgenda) return;
    const hoje = new Date();
    const tarefasHoje = tarefas
      .filter(t => new Date(t.data) >= hoje)
      .filter(tarefa => tarefaEhDoDia(tarefa, hoje));

    listaAgenda.innerHTML = tarefasHoje.length === 0
      ? "<p>🎈 Nada marcado para hoje!</p>"
      : tarefasHoje.map(t =>
        `<li class="mb-2"><pre class="whitespace-pre-wrap bg-rose-100 rounded p-2">${formatarExibicao({ ...t, tipo: 'tarefa' }, 'tarefa')}</pre></li>`
      ).join('');
  }

  // --- SUGESTÃO DE TAREFA ---
  function mostrarSugestao() {
    const sugestoes = [
      'Lavar a louça',
      'Estudar JavaScript',
      'Organizar o armário',
      'Fazer caminhada',
      'Ler um livro',
      'Limpar a mesa',
      'Responder e-mails',
      'Planejar cardápio',
      'Alongar-se',
      'Agradecer por 3 coisas',
      'Organizar arquivos',
      'Ouvir música',
      'Tentar receita nova',
      'Revisar metas',
      'Meditar 5min',
      'Mandar mensagem carinhosa',
      'Separar doações',
      'Planejamento financeiro',
      'Escrever no diário',
      'Limpar notificações',
      'Fazer pausa ativa (5 min de alongamento ou caminhada curta)',
      'Organizar fotos no celular/computador',
      'Limpar a geladeira (descartar o que venceu)',
      'Planejar os estudos da semana',
      'Preparar lanche saudável para o dia',
      'Separar roupas para lavar',
      'Escrever uma lista de agradecimentos',
      'Revisar orçamento doméstico',
      'Desconectar das redes sociais por 1h',
      'Organizar senhas e atualizar o gerenciador',
      'Praticar inglês com app ou vídeo curto',
      'Fazer exercício de respiração (3 min)',
      'Atualizar calendário com compromissos',
      'Trocar roupas de cama e toalhas',
      'Fazer backup dos arquivos importantes',
      'Assistir aula/tutorial de algo novo (5 a 10 min)',
      'Limpar a caixa de entrada do e-mail (apagar/arquivar)',
      'Planejar um hobby ou tempo de lazer para a semana',
      'Criar ou revisar checklist das tarefas domésticas',
      'Fazer chamada rápida para alguém querido'


    ];
    sugestaoTarefa.textContent = sugestoes[Math.floor(Math.random() * sugestoes.length)];
  }

  function abrirFormularioComItem(tarefa) {
  // Preenche o formulário com os dados da tarefa
  form['task-title'].value = tarefa.titulo.replace(/^.\s/, ''); // remove o ícone
  form['task-description'].value = tarefa.descricao;
  form['task-topic'].value = tarefa.categoria;
  form['task-priority'].value = tarefa.prioridade;
  form['task-recurrence-type'].value = tarefa.recorrencia;
  form['task-date'].value = tarefa.data;
  form['task-alarm'].value = tarefa.hora;
  
  // Ajusta dias da semana
  ajustarDiasSemana();
  if (tarefa.diasSemana && tarefa.diasSemana.length > 0) {
    form.querySelectorAll('input[name="dias-semana"]').forEach(input => {
      input.checked = tarefa.diasSemana.includes(input.value);
    });
  }

  // Guarda o index para atualizar ao salvar
  form.dataset.editIndex = tarefas.indexOf(tarefa);

  // Abre a tela do formulário (caso esteja oculta)
  form.parentElement.classList.remove('hidden');
}

  // --- FORMULÁRIO ---
 form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const diasSelecionados = Array.from(
    form.querySelectorAll('input[name="dias-semana"]:checked')
  ).map(input => input.value);

  const categoria = form['task-topic'].value;
  const tituloSemIcone = form['task-title'].value.trim();
  const icone = obterIconeCategoria(categoria);
  const editIndex = form.dataset.editIndex;

  if (!tituloSemIcone) {
    alert('Por favor, preencha o título da tarefa!');
    return;
  }

  const novaTarefa = {
    titulo: `${icone} ${tituloSemIcone || 'Sem título'}`,
    descricao: form['task-description'].value.trim(),
    categoria,
    prioridade: form['task-priority'].value,
    recorrencia: form['task-recurrence-type'].value,
    diasSemana: diasSelecionados,
    data: form['task-date'].value,
    hora: form['task-alarm'].value,
    lembrete: form['task-reminder']?.value || 'N/A',
  };

  const isRecorrente = novaTarefa.recorrencia && novaTarefa.recorrencia !== "Nenhuma";
  novaTarefa.proximaOcorrencia = isRecorrente
    ? calcularProximaOcorrencia(novaTarefa.data, novaTarefa.recorrencia)
    : null;

  if (editIndex !== undefined) {
    // Atualiza a tarefa existente
    tarefas[editIndex] = novaTarefa;
    delete form.dataset.editIndex; // limpa o flag
  } else {
    // Adiciona nova tarefa
    tarefas.push(novaTarefa);
  }

  await salvarTarefa(novaTarefa);
  salvarLocal();
  renderizarTarefas();
  mostrarAgendaDoDia();
  form.reset();
  ajustarDiasSemana();
});


  // --- BOTÕES ---
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  }
  if (botaoVoltar) botaoVoltar.addEventListener('click', voltarParaHome);

  // --- INICIALIZAÇÃO ---
  tarefas = await listarTarefas();
  processarRecorrencias();
  salvarLocal();
  renderizarTarefas();
  mostrarSugestao();
  mostrarAgendaDoDia();
});