import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';


document.addEventListener("DOMContentLoaded", function () {
  initLembretes('contas', 'lista-contas', 'mensagemVazia');

  const form = document.getElementById("form-contas");
  const listaContas = document.getElementById("lista-contas");
  const mensagemVazia = document.getElementById("mensagemVazia");
  const dicaFinanceira = document.getElementById("dica-financeira");

  let contas = JSON.parse(localStorage.getItem("contas")) || [];

  function renderizarContas() {
    // Limpa todos os <li> sem apagar o <p> da mensagem vazia
    const itens = listaContas.querySelectorAll("li");
    itens.forEach(item => item.remove());

    if (contas.length === 0) {
      mensagemVazia.style.display = "block";
      return;
    }

    mensagemVazia.style.display = "none";

    contas.forEach((conta, index) => {
      const li = document.createElement("li");
      li.classList.add(
        "mb-4", "p-3", "rounded-lg", "shadow",
        "bg-purple-50", "hover:bg-rose-50", "cursor-pointer"
      );

      const icone = obterIconeCategoria(conta.nome || 'conta');

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      <p>
  <strong class="text-pink-500">${icone} ${conta.nome}</strong>
</p>

      ${conta.descricao ? `
        <p>
          <span class="text-pink-500">📝 Descrição:</span> 
          <span class="text-black italic">${conta.descricao}</span>
        </p>
      ` : ''}

      <p>
        <span class="text-pink-500">💰 Valor:</span> R$ ${Number(conta.valor).toFixed(2)}
      </p>
      <p>
        <span class="text-pink-500">📅 Vencimento:</span> ${conta.vencimento}
      </p>
      <p>
        <span class="text-pink-500">✅ Paga:</span> ${conta.paga === "sim" ? "Sim" : "Não"}
      </p>
      <p>
        <span class="text-pink-500">🔁 Repetir:</span> ${conta.repetir}
      </p>
      ${(conta.lembreteData || conta.lembreteHora) ? `
        <p>
          <span class="text-pink-500">🔔 Lembrete:</span> ${conta.lembreteData || ''} ${conta.lembreteHora || ''}
        </p>
      ` : ''}
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover conta"
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


      listaContas.appendChild(li);

    });
  }

  function salvarContas() {
    localStorage.setItem("contas", JSON.stringify(contas));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const novaConta = {
      nome: document.getElementById("conta-nome").value,
      descricao: document.getElementById("conta-descricao").value,
      valor: document.getElementById("conta-valor").value,
      date: document.getElementById("conta-vencimento").value, // <== mudou para 'date'
      paga: document.getElementById("conta-paga").checked ? "sim" : "nao",
      repetir: document.getElementById("conta-repetir").value,
      lembreteData: document.querySelector("#conta-lembrete-data").value,
      lembreteHora: document.querySelector("#conta-lembrete-hora").value,
      title: `Conta: ${document.getElementById("conta-nome").value}` // <== adiciona title
    };


    contas.push(novaConta);
    salvarContas();
    renderizarContas();
    form.reset();
  });

  listaContas.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      contas.splice(index, 1);
      salvarContas();
      renderizarContas();
    }
  });

  function gerarDicaFinanceira() {
    const dicas = [
      "🧾 Anote todos os seus gastos. Até o cafezinho!",
      "📊 Faça um planejamento mensal e siga com disciplina.",
      "💳 Evite usar o cartão de crédito para tudo.",
      "🚫 Não compre por impulso. Espere 24h antes de decidir.",
      "💰 Guarde uma parte da sua renda, mesmo que seja pouco.",
      "🏦 Considere investir o que sobra ao invés de deixar parado.",
      "📉 Renegocie dívidas com juros altos sempre que possível.",
      "💡 Compare preços antes de comprar para economizar.",
      "📅 Estabeleça metas financeiras mensais e acompanhe o progresso.",
      "🛑 Cuidado com empréstimos que têm taxas abusivas.",
      "💸 Faça uma reserva de emergência para imprevistos.",
      "📱 Use apps de controle financeiro para facilitar a organização.",
      "🎯 Priorize pagar dívidas com maior juros primeiro.",
      "📦 Venda itens que não usa para gerar uma renda extra.",
      "🛍️ Evite promoções que não se encaixam no seu orçamento."
    ];

    const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
    dicaFinanceira.textContent = dicaAleatoria;
  }

  // Inicialização
  renderizarContas();
  gerarDicaFinanceira();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
