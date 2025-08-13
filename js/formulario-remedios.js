import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';


document.addEventListener("DOMContentLoaded", () => {
  // 🌟 ELEMENTOS DO DOM
  const form = document.querySelector("form");
  const lista = document.getElementById("lista-remedios");
  const mensagemVazia = document.getElementById("mensagemVazia");
  const elementoDica = document.getElementById("dica-remedios");

  // 🌟 DICAS ROTATIVAS DE REMÉDIOS
  const dicasRemedios = [
    "⏰ Nunca esqueça de tomar o remédio na hora certa!",
    "👶 Mantenha os remédios fora do alcance de crianças.",
    "📖 Leia sempre a bula antes de usar qualquer medicamento.",
    "🚫 Não misture remédios sem orientação médica.",
    "❄️ Armazene os remédios em local fresco e seco.",
    "📝 Registre o horário e a dosagem para não errar a dose.",
    "⚠️ Se sentir efeitos colaterais, consulte seu médico imediatamente.",
    "📱 Use um alarme no celular para ajudar a lembrar.",
    "🕰️ Não utilize remédios após o prazo de validade.",
    "🚫 Nunca compartilhe seus medicamentos com outras pessoas.",
    "🩺 Informe seu médico sobre todos os remédios que está tomando.",
    "🍽️ Descubra se o medicamento precisa ser tomado com ou sem alimento.",
    "♻️ Descarte remédios vencidos de forma segura.",
    "✔️ Evite automedicação — só tome remédios com prescrição médica."
  ];

  function atualizarDica() {
    if (!elementoDica) return;
    const dicaAleatoria = dicasRemedios[Math.floor(Math.random() * dicasRemedios.length)];
    elementoDica.textContent = dicaAleatoria;
  }

  // 💾 LOCALSTORAGE
  function pegarRemediosStorage() {
    return JSON.parse(localStorage.getItem("remedios")) || [];
  }

  function salvarRemediosStorage(remedios) {
    localStorage.setItem("remedios", JSON.stringify(remedios));
  }

  // 📋 LISTA DE REMÉDIOS
  function atualizarListaRemedios() {
    const remedios = pegarRemediosStorage();
    lista.innerHTML = "";

    if (remedios.length === 0) {
      mensagemVazia.style.display = "block";
      return;
    }

    mensagemVazia.style.display = "none";

    remedios.forEach((remedio, index) => {
      const li = document.createElement("li");
      li.className = "mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer";

      const icone = obterIconeCategoria(remedio.categoria || 'remedio');

      // Aqui você vai juntar os horários para exibir no lugar do campo "Horário"
      const horariosTexto = remedio.horarios ? remedio.horarios.join(", ") : "–";

      // Monta o título (ícone + nome)
      const tituloFormatado = `${icone} ${remedio.nome}`;

      // Agora, monte manualmente o HTML completo do remédio com os horários agrupados no lugar certo
      li.innerHTML = `
<div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
  <div class="flex-1 space-y-2 text-base font-semibold">

<div><span class="text-pink-500">${icone} (Remédio <span class="text-black font-medium italic">(${remedio.nome})</span></div>
    <div><span class="text-pink-500">⚖️ Dosagem:</span> <span class="text-black">${remedio.dosagem}</span></div>
    <div><span class="text-pink-500">📆 Dias:</span> <span class="text-black">${remedio.diasSemana.join(", ")}</span></div>
    <div><span class="text-pink-500">🔁 Frequência:</span> <span class="text-black">${remedio.frequencia}</span></div>
    <div><span class="text-pink-500">⏰ Horário:</span> <span class="text-black">${horariosTexto}</span></div> 
    <div><span class="text-pink-500">📅 Data:</span> <span class="text-black">${remedio.data}</span></div>
    <div><span class="text-pink-500">⏳ Duração:</span> <span class="text-black">${remedio.duracao}</span></div>
    <div><span class="text-pink-500">📝 Observações:</span> <span class="text-black">${remedio.observacoes || "–"}</span></div>
    <div><span class="text-pink-500">🔔 Alarme:</span> <span class="text-black">${remedio.alarme || "–"}</span></div>

  </div>

      <button 
        class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
        data-index="${index}" 
        title="Remover remédio"
        type="button"
      >
        Remover
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
          style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;</span>
      </button>
    </div>
  `;

      lista.appendChild(li);
    });


    adicionarEventosRemocao();
  }

  // ❌ REMOÇÃO
  function adicionarEventosRemocao() {
    document.querySelectorAll(".btn-remover").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        removerRemedio(index);
      });
    });
  }

  function removerRemedio(index) {
    const remedios = pegarRemediosStorage();
    remedios.splice(index, 1);
    salvarRemediosStorage(remedios);
    atualizarListaRemedios();
  }

  // ✅ FORMULÁRIO
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // outros campos...
    const nome = document.getElementById("remedio-nome").value.trim();
    const dosagem = document.getElementById("remedio-dosagem").value.trim();
    const frequencia = document.getElementById("remedio-frequencia").value.trim();
    // NÃO pegar só um horário, mas todos os horários:
    const horariosInputs = document.querySelectorAll('input[name="remedio-horarios"]');
    const horarios = Array.from(horariosInputs)
      .map(input => input.value.trim())
      .filter(h => h !== ""); // só horários preenchidos

    const date = document.getElementById("remedio-data").value.trim();
    const duracao = document.getElementById("remedio-duracao").value.trim();
    const observacoes = document.getElementById("remedio-observacoes").value.trim();
    const alarme = form.querySelector("#task-alarm")?.value || "";

    // dias da semana
    const checkboxes = document.querySelectorAll('input[name="dias-semana"]:checked');
    const diasSelecionados = Array.from(checkboxes).map(cb => cb.value);

    if (!nome || !dosagem || !frequencia || horarios.length === 0 || !date || !duracao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (diasSelecionados.length === 0) {
      alert("Por favor, selecione ao menos um dia da semana.");
      return;
    }

    const remedio = {
      nome,
      dosagem,
      frequencia,
      horarios, // array de horários aqui
      data: date,
      duracao,
      observacoes,
      alarme,
      diasSemana: diasSelecionados,
      tipo: "remedio",
      categoria: "remedio"
    };

    const remedios = pegarRemediosStorage();
    remedios.push(remedio);

    salvarRemediosStorage(remedios);
    form.reset();
    atualizarListaRemedios();
  });


  atualizarDica();
  setInterval(atualizarDica, 10000);
  atualizarListaRemedios();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }


  const horariosContainer = document.getElementById("horarios-container");

  // Botão +
  const botaoAdicionarHorario = document.getElementById("adicionar-horario");

  botaoAdicionarHorario.addEventListener("click", () => {
    // Criar um novo div com input time
    const novoHorarioDiv = document.createElement("div");
    novoHorarioDiv.className = "flex gap-2 mb-2";

    const novoInput = document.createElement("input");
    novoInput.type = "time";
    novoInput.name = "remedio-horarios";
    novoInput.className = "w-full max-w-[500px] mt-2 mb-2 px-3 py-3 border-2 border-pink-300 rounded-lg bg-stone-50 text-base text-gray-700 transition duration-300 ease-in-out focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200";

    // Botão remover para o input extra (opcional, pra remover um horário)
    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.textContent = "–";
    botaoRemover.className = "text-red-600 font-bold text-xl";

    botaoRemover.addEventListener("click", () => {
      novoHorarioDiv.remove();
    });

    novoHorarioDiv.appendChild(novoInput);
    novoHorarioDiv.appendChild(botaoRemover);

    // Inserir antes do botão "+"
    horariosContainer.appendChild(novoHorarioDiv);
  });

});