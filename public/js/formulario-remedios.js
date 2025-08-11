import { voltarParaHome } from './funcoes-globais.js';
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
      if (remedio.horarios && remedio.horarios.length > 0) {
        remedio.horarios.forEach(horario => {
          const li = document.createElement("li");

          li.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
          <div class="flex-1 space-y-2 text-base font-semibold text-black">
            <p><span class="text-pink-500">💊 Nome:</span> ${remedio.nome}</p>
            <p><span class="text-pink-500">⚖️ Dosagem:</span> ${remedio.dosagem}</p>
            <p><span class="text-pink-500">⏳ Frequência:</span> ${remedio.frequencia}</p>
            <p><span class="text-pink-500">⏰ Horário:</span> ${horario}</p>
            ${remedio.duracao ? `<p><span class="text-pink-500">📅 Duração:</span> ${remedio.duracao}</p>` : ''}
            <p><span class="text-pink-500">📝 Observações:</span> ${remedio.observacoes || "Nenhuma"}</p>
            <p><span class="text-pink-500">⏰ Alarme:</span> <span class="${remedio.alarme ? 'text-red-600' : 'text-gray-400'}">${remedio.alarme || "Não definido"}</span></p>
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
      } else {
        const li = document.createElement("li");

        li.innerHTML = `
      <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
        <div class="flex-1 space-y-2 text-base font-semibold text-black">
          <p><span class="text-pink-500">💊 Nome:</span> ${remedio.nome}</p>
          <p><span class="text-pink-500">⚖️ Dosagem:</span> ${remedio.dosagem}</p>
          <p><span class="text-pink-500">⏳ Frequência:</span> ${remedio.frequencia}</p>
          <p><span class="text-pink-500">📅 Duração:</span> ${remedio.duracao}</p>
          <p><span class="text-pink-500">📝 Observações:</span> ${remedio.observacoes || "Nenhuma"}</p>
          <p><span class="text-pink-500">⏰ Alarme:</span> <span class="${remedio.alarme ? 'text-red-600' : 'text-gray-400'}">${remedio.alarme || "Não definido"}</span></p>
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
      }
    });


    adicionarEventosRemocao();
  }

  // ❌ REMOÇÃO
  function adicionarEventosRemocao() {
    document.querySelectorAll(".btn-remover").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
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

    const inputs = form.querySelectorAll("input, textarea");
    const [nome, dosagem, frequencia, horario, duracao, observacoes] = Array.from(inputs).map(input => input.value.trim());
    const alarme = form.querySelector("#task-alarm")?.value || "";

    if (!nome || !dosagem || !frequencia || !horario || !duracao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const remedio = { nome, dosagem, frequencia, horario, duracao, observacoes, alarme };
    const remedios = pegarRemediosStorage();
    remedios.push(remedio);

    horarios.forEach(horario => {
      lembretes.push({
        title: `Remédio: ${nomeLimpo}`,
        lembreteHora: horario,
        lembreteData: date,
        descricao: `${dosagem} — ${diasSelecionados.join(', ')}`,
        tipo: "remedio"
      });
    });


    salvarRemediosStorage(remedios);
    form.reset();
    atualizarListaRemedios();
  });

  // 🚀 INICIALIZAÇÃO
  atualizarDica();
  setInterval(atualizarDica, 10000); // a cada 10s, nova dica
  atualizarListaRemedios();


  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
