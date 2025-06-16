// formulario-limpeza.js

// Referências dos elementos do DOM
const form = document.querySelector("form");
const listaLimpezas = document.getElementById("lista-limpezas");
const mensagemVazia = document.getElementById("mensagemVazia");

// Função para carregar tarefas do localStorage e mostrar na tela
function carregarLista() {
  const tarefasJSON = localStorage.getItem("tarefasLimpeza");
  if (!tarefasJSON) {
    listaLimpezas.innerHTML = "";
    mensagemVazia.style.display = "block";
    return [];
  }

  const tarefas = JSON.parse(tarefasJSON);

  if (tarefas.length === 0) {
    listaLimpezas.innerHTML = "";
    mensagemVazia.style.display = "block";
    return [];
  }

  mensagemVazia.style.display = "none";
listaLimpezas.innerHTML = "";

tarefas.forEach((tarefa, index) => {
  const li = document.createElement("li");
  li.className = "mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer";

 li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
    <div class="flex-1 space-y-1 text-base font-semibold">
      <p>
        <span class="text-pink-500">Cômodo:</span>
        <span class="text-black">${tarefa.comodo}</span>
      </p>
      <p>
        <span class="text-pink-500">Tarefa:</span>
        <span class="text-black">${tarefa.tarefa}</span>
      </p>
      <p>
        <span class="text-pink-500">Frequência:</span>
        <span class="text-black">${tarefa.frequencia}</span>
      </p>
      <p>
        <span class="text-pink-500">Dia da Limpeza:</span>
        <span class="text-black">${tarefa.dia || '-'}</span>
      </p>
      <p>
        <span class="text-pink-500">Horário:</span>
        <span class="text-black">${tarefa.horario || '-'}</span>
      </p>
      <p>
        <span class="text-pink-500">🔔 Lembrete:</span>
        <span class="text-black">${tarefa.lembreteData || '-'}</span>
        <span class="text-pink-500 ml-2">às</span>
        <span class="text-black">${tarefa.lembreteHora || '-'}</span>
      </p>
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

listaLimpezas.appendChild(li);
  });

  return tarefas;
}

// Função para salvar tarefas no localStorage
function salvarLista(tarefas) {
  localStorage.setItem("tarefasLimpeza", JSON.stringify(tarefas));
}

// Validação simples do formulário
function validarFormulario(dados) {
  if (!dados.comodo) {
    alert("Por favor, selecione um cômodo.");
    return false;
  }
  if (!dados.tarefa) {
    alert("Por favor, selecione uma tarefa.");
    return false;
  }
  if (!dados.frequencia) {
    alert("Por favor, selecione a frequência.");
    return false;
  }
  return true;
}

// Evento submit do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dados = {
    comodo: form.querySelector("#comodo").value.trim(),
    tarefa: form.querySelector("#tarefa").value.trim(),
    frequencia: form.querySelector("#frequencia").value,
    dia: form.querySelector("#dia").value,
    horario: form.querySelector("#inputHorarioConsulta").value,
    lembreteData: form.querySelector("#lembrete-data").value,
    lembreteHora: form.querySelector("#lembrete-hora").value,
  };

  if (!validarFormulario(dados)) return;

  const tarefas = carregarLista();
  tarefas.push(dados);
  salvarLista(tarefas);

  form.reset();
  carregarLista();
});

// Evento para excluir tarefas ao clicar no botão da lixeira
listaLimpezas.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const btn = e.target.closest("button");
    const index = Number(btn.getAttribute("data-index"));
    let tarefas = carregarLista();
    tarefas.splice(index, 1);
    salvarLista(tarefas);
    carregarLista();
  }
});

// Carrega a lista assim que a página é carregada
window.addEventListener("DOMContentLoaded", carregarLista);

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
  "Abra as janelas para renovar o ar enquanto limpa."
];

document.getElementById("dica-limpeza").textContent =
  dicasLimpeza[Math.floor(Math.random() * dicasLimpeza.length)];