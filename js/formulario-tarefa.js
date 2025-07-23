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

  // FUNÇÃO para ativar/desativar os checkboxes dos dias conforme a recorrência
  function ajustarDiasSemana() {
    const tipoRecorrencia = selectRecurrence.value;
    const campoDiaDoMes = document.getElementById('campo-dia-do-mes');

    if (['daily', 'weekly', 'custom', 'monthly'].includes(tipoRecorrencia)) {
      // Agora inclui "monthly"
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


      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      ${formatarExibicao({
        ...tarefa,
        categoria: tarefa.categoria || tarefa.topic || 'N/A'
      }, 'tarefa')}

    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
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
        const ehDiaDaSemanaMarcado = diasSelecionados.includes(hoje.getDay().toString());


        if (diasSelecionados.length > 0) {
          return ehDiaDaSemanaMarcado;
        }

        return ehMesmoDiaDoMes;


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

    const tarefasHoje = tarefas.filter(tarefa => tarefaEhDoDia(tarefa, hoje));

    listaAgenda.innerHTML = tarefasHoje.length === 0
      ? "<p>🎈 Nada marcado para hoje!</p>"
      : tarefasHoje.map(t =>
        `<li class="mb-2"><pre class="whitespace-pre-wrap bg-rose-100 rounded p-2">${formatarExibicao({ ...t, tipo: 'tarefa' }, 'tarefa')}
</pre></li>`
      ).join('');
  }



  // ENVIO DO FORMULÁRIO
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Pega dias selecionados no checkbox
    const diasSelecionados = Array.from(form.querySelectorAll('input[name="dias-semana"]:checked'))
      .map(input => input.value);

    const categoria = form['task-topic'].value;
    const tituloSemIcone = form['task-title'].value.trim();
    const icone = obterIconeCategoria(categoria);

    const tarefa = {
      titulo: `${icone} ${tituloSemIcone || 'Sem título'}`,
      descricao: form['task-description'].value.trim(),
      categoria: categoria,
      prioridade: form['task-priority'].value,
      recorrencia: form['task-recurrence-type'].value,
      diasSemana: diasSelecionados,
      data: form['task-date'].value,
      hora: form['task-alarm'].value,
      lembrete: form['task-reminder']?.value || 'N/A', // se tiver esse campo

    };

    if (!tituloSemIcone) {
      alert('Por favor, preencha o título da tarefa!');
      return;
    }

    console.log('Tarefa a ser salva:', tarefa);
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
