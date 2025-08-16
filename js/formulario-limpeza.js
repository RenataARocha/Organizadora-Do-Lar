import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener("DOMContentLoaded", () => {
  initLembretes('limpeza', 'lista-limpezas', 'mensagemVazia');

  const form = document.querySelector("form");
  const listaLimpezas = document.getElementById("lista-limpezas");
  const mensagemVazia = document.getElementById("mensagemVazia");

  function carregarLista() {
    const tarefasJSON = localStorage.getItem("limpeza");
    listaLimpezas.innerHTML = ""; 

    if (!tarefasJSON) {
      mensagemVazia.style.display = "block";
      return [];
    }

    const tarefas = JSON.parse(tarefasJSON);
    if (tarefas.length === 0) {
      mensagemVazia.style.display = "block";
      return [];
    }

    mensagemVazia.style.display = "none";

    tarefas.forEach((tarefa, index) => {
      const li = document.createElement("li");
      li.className = "mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer";

      li.innerHTML = `
      <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
        <div class="flex-1 space-y-2 text-base font-semibold text-black">
          ${formatarExibicao(tarefa, 'limpeza')}
        </div>
        <div class="flex flex-col items-end gap-2">
          <button
  class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden"
  data-index="${index}"
  title="Remover tarefa"
  type="button"
>
  Remover
  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
    style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
  </span>
</button>
          <button
            class="relative bg-pink-400 text-white h-fit py-2 pr-12 pl-7 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden btn-editar"
            data-index="${index}"
            title="Editar tarefa"
            type="button"
          >
            Editar
           <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
      style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
    </span>
          </button>
        </div>
      </div>
    `;
      listaLimpezas.appendChild(li);
    });

    adicionarEventosRemocao();
    adicionarEventosEdicao();
    return tarefas;
  }


  function adicionarEventosRemocao() {
    document.querySelectorAll(".btn-remover").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const tarefas = carregarLista();
        tarefas.splice(index, 1);
        salvarLista(tarefas);
        carregarLista();
      });
    });
  }

  function adicionarEventosEdicao() {
    document.querySelectorAll(".btn-editar").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const tarefas = JSON.parse(localStorage.getItem("limpeza")) || [];
        const tarefa = tarefas[index];
        if (!tarefa) return;

        // Preenche os campos do formulário com os valores atuais
        selectComodo.value = tarefa.comodo;
        selectComodo.dispatchEvent(new Event('change'));
        selectTarefa.value = tarefa.descricao;
        if (tarefa.descricao === "Outros") {
          campoTarefaOutros.classList.remove("hidden");
          document.getElementById("tarefaOutros").value = tarefa.descricaoPersonalizada || "";
        } else {
          campoTarefaOutros.classList.add("hidden");
        }
        form.querySelector("#frequencia").value = tarefa.frequencia;
        form.querySelector("#dia").value = tarefa.data;
        form.querySelector("#inputHorarioConsulta").value = tarefa.hora;
        form.querySelector("#lembrete-data").value = tarefa.lembreteData || "";
        form.querySelector("#lembrete-hora").value = tarefa.lembreteHora || "";

        // Indica que estamos editando
        form.dataset.editIndex = index;
        form.dataset.editing = "true";
        form.querySelector('button[type="submit"]').textContent = "Atualizar Tarefa";
        mensagemVazia.style.display = "none";
      });
    });
  }

  function salvarLista(tarefas) {
    localStorage.setItem("limpeza", JSON.stringify(tarefas));
  }

  function validarFormulario(dados) {
    if (!dados.comodo) {
      alert("Por favor, selecione um cômodo.");
      return false;
    }
    if (!dados.descricao) {
      alert("Por favor, selecione uma tarefa.");
      return false;
    }
    if (!dados.frequencia) {
      alert("Por favor, selecione a frequência.");
      return false;
    }
    if (!dados.data) {
      alert("Por favor, selecione a data da limpeza.");
      return false;
    }
    return true;
  }

  function adicionarTempo(dataStr, frequencia) {
    const data = new Date(dataStr);
    switch (frequencia.toLowerCase()) {
      case "diária": data.setDate(data.getDate() + 1); break;
      case "semanal": data.setDate(data.getDate() + 7); break;
      case "quinzenal": data.setDate(data.getDate() + 15); break;
      case "mensal": data.setMonth(data.getMonth() + 1); break;
      case "anual": data.setFullYear(data.getFullYear() + 1); break;
    }
    return data.toISOString().slice(0, 10);
  }

  function atualizarRecorrencias() {
    const tarefas = carregarLista();
    let alterou = false;
    const hoje = new Date().toISOString().slice(0, 10);

    tarefas.forEach(tarefa => {
      if (tarefa.frequencia && tarefa.frequencia.toLowerCase() !== "nenhuma") {
        if (tarefa.data <= hoje) {
          tarefa.data = adicionarTempo(tarefa.data, tarefa.frequencia);
          if (tarefa.lembreteData && tarefa.lembreteData <= hoje) {
            tarefa.lembreteData = adicionarTempo(tarefa.lembreteData, tarefa.frequencia);
          }
          alterou = true;
        }
      }
    });

    if (alterou) salvarLista(tarefas);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const comodo = selectComodo.value.trim() || 'Cômodo não informado';
    let descricao = selectTarefa.value.trim() || 'Tarefa não informada';
    if (descricao === "Outros") {
      const personalizada = document.getElementById("tarefaOutros").value.trim();
      if (!personalizada) { alert("Por favor, descreva a tarefa personalizada."); return; }
      descricao = personalizada;
    }

    const dados = {
      comodo,
      descricao,
      frequencia: form.querySelector("#frequencia").value,
      data: form.querySelector("#dia").value,
      hora: form.querySelector("#inputHorarioConsulta").value,
      lembreteData: form.querySelector("#lembrete-data").value || form.querySelector("#dia").value,
      lembreteHora: form.querySelector("#lembrete-hora").value,
      titulo: `${comodo} — ${descricao}`,
    };

    if (!validarFormulario(dados)) return;

    const tarefas = JSON.parse(localStorage.getItem("limpeza")) || [];

    if (form.dataset.editIndex !== undefined) {
      const idx = parseInt(form.dataset.editIndex, 10);
      tarefas[idx] = dados;
      delete form.dataset.editIndex;
      delete form.dataset.editing;
      form.querySelector('button[type="submit"]').textContent = "Adicionar Tarefa";
    } else {
      tarefas.push(dados);
    }

    salvarLista(tarefas);
    form.reset();
    selectTarefa.innerHTML = '<option value="">Selecione</option>';
    campoTarefaOutros.classList.add("hidden");

    carregarLista();
  });


  atualizarRecorrencias();
  carregarLista();

  const dicasLimpeza = [
    "Use vinagre branco com bicarbonato para desinfetar o banheiro.",
    "Separe 15 minutinhos por dia pra dar aquela geral em um cômodo.",
    "Use jornal velho pra deixar os vidros brilhando, sem marcas.",
    "Escova de dentes velha? Ótima pra cantinhos difíceis!",
    "Faça uma lista semanal pra evitar que a sujeira acumule.",
    "Limpe a geladeira regularmente para evitar odores e desperdícios.",
    "Deixe produtos de limpeza sempre organizados e ao alcance.",
    "Para tirar manchas de carpetes, use vinagre diluído em água.",
    "Lave panos e esponjas com frequência para evitar bactérias.",
    "Abra as janelas para renovar o ar enquanto limpa.",
    "Polvilhe bicarbonato no tapete, deixe 10 minutos e aspire para tirar odores.",
    "Use uma meia velha na mão para tirar pó de persianas e grades.",
    "Mistura de vinagre + detergente é perfeita para limpar box de banheiro.",
    "Passe um pano com amaciante diluído nos móveis para afastar pó e deixar perfume.",
    "Deixe o micro-ondas com cheiro bom fervendo água e limão por 3 minutos.",
    "Bicarbonato no fundo da lixeira evita mau cheiro.",
    "Use rodo com um pano úmido para alcançar embaixo dos móveis sem arrastar.",
    "Limpe controle remoto e maçanetas com álcool 70% para desinfetar.",
    "Mantenha o guarda-roupa arejado e coloque sachês contra mofo.",
    "Troque panos de prato diariamente para evitar bactérias."
  ];

  const dicaElemento = document.getElementById("dica-limpeza");
  if (dicaElemento) {
    dicaElemento.textContent =
      dicasLimpeza[Math.floor(Math.random() * dicasLimpeza.length)];
  }

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }

  const tarefasPorComodo = {
    "Cozinha": ["Lavar louças", "Guardar louças", "Limpar geladeira", "Organizar armários", "Varrer", "Passar pano", "Lavar banheiro", "Faxina geral", "Outros"],
    "Banheiro": ["Lavar banheiro", "Organizar armários", "Varrer", "Passar pano", "Faxina geral", "Outros"],
    "Quarto": ["Faxinar quarto", "Dobrar e guardar roupas", "Organizar guarda roupa", "Limpa guarda roupa", "Varrer", "Passar pano", "Faxina geral", "Outros"],
    "Sala": ["Limpar sofá", "Varrer", "Passar pano", "Faxina geral", "Outros"],
    "Área de Serviço": ["Lavar roupas", "Estender roupas", "Lavar", "Varrer", "Passar pano", "Faxina geral", "Outros"],
    "Varanda": ["Lavar varandas", "Varrer", "Passar pano", "Faxina geral", "Outros"],
    "Área de lazer": ["Limpar piscina", "Varrer", "Lavar", "Faxina geral", "Outros"],
    "Outros": ["Colocar lixo para fora", "Varrer", "Passar pano", "Faxina geral", "Outros"]
  };

  const selectComodo = document.getElementById("comodo");
  const selectTarefa = document.getElementById("tarefa");
  const campoTarefaOutros = document.getElementById("campoTarefaOutros");

  campoTarefaOutros.classList.add("hidden");

  selectTarefa.addEventListener("change", () => {
    if (selectTarefa.value === "Outros") {
      campoTarefaOutros.classList.remove("hidden");
    } else {
      campoTarefaOutros.classList.add("hidden");
    }
  });

  selectComodo.addEventListener("change", () => {
    const comodoSelecionado = selectComodo.value;
    const tarefas = tarefasPorComodo[comodoSelecionado] || [];

    selectTarefa.innerHTML = '<option value="">Selecione</option>';
    tarefas.forEach(tarefa => {
      const option = document.createElement("option");
      option.value = tarefa;
      option.textContent = tarefa;
      selectTarefa.appendChild(option);
    });
  });
});