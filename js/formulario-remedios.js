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
  const elementoDica = document.getElementById("dica-remedios");
  if (!elementoDica) return;

  const dicaAleatoria = dicasRemedios[Math.floor(Math.random() * dicasRemedios.length)];
  elementoDica.textContent = dicaAleatoria;
}

// 💾 LOCALSTORAGE: Pegar e Salvar
function pegarRemediosStorage() {
  return JSON.parse(localStorage.getItem("remedios")) || [];
}

function salvarRemediosStorage(remedios) {
  localStorage.setItem("remedios", JSON.stringify(remedios));
}

// 📋 ATUALIZAÇÃO DA LISTA DE REMÉDIOS
function atualizarListaRemedios() {
  const lista = document.getElementById("lista-remedios");
  const mensagemVazia = document.getElementById("mensagemVazia");
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

    li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 relative">
    <div class="flex-1 space-y-1 text-base font-semibold">
      <p><span class="text-pink-500">Nome:</span> <span class="text-black">${remedio.nome}</span></p>
      <p><span class="text-pink-500">Dosagem:</span> <span class="text-black">${remedio.dosagem}</span></p>
      <p><span class="text-pink-500">Frequência:</span> <span class="text-black">${remedio.frequencia}</span></p>
      <p><span class="text-pink-500">Horário:</span> <span class="text-black">${remedio.horario}</span></p>
      <p><span class="text-pink-500">Duração:</span> <span class="text-black">${remedio.duracao}</span></p>
      <p><span class="text-pink-500">Observações:</span> <span class="text-black">${remedio.observacoes || "Nenhuma"}</span></p>
      <p><span class="text-pink-500">⏰ Alarme:</span> <span class="text-black">${remedio.alarme || "Não definido"}</span></p>
    </div>
    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden"
      data-index="${index}" 
      title="Remover remédio"
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

lista.appendChild(li);

  });

  adicionarEventosRemocao();
}

function adicionarEventosRemocao() {
  document.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", (e) => {
      const index = e.currentTarget.getAttribute("data-index");
      removerRemedio(index);
    });
  });
}

// ❌ REMOÇÃO DE REMÉDIO
function removerRemedio(index) {
  const remedios = pegarRemediosStorage();
  remedios.splice(index, 1);
  salvarRemediosStorage(remedios);
  atualizarListaRemedios();
}

// ✅ FORMULÁRIO DE ADIÇÃO
function configurarFormulario() {
  const form = document.querySelector("form");

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

    salvarRemediosStorage(remedios);
    form.reset();
    atualizarListaRemedios();
  });
}

// 🚀 INICIALIZAÇÃO
window.addEventListener("load", () => {
  atualizarDica();
  setInterval(atualizarDica, 10000); // atualiza dica a cada 10s
  atualizarListaRemedios();
  configurarFormulario();
});
