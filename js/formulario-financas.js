import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';


document.addEventListener("DOMContentLoaded", () => {
  // ---------- Dica Financeira do Dia ----------
  const dicasFinanceiras = [
    "Anote todos os seus gastos, até os pequenos. Eles fazem diferença no fim do mês!",
    "Evite parcelar compras no cartão. Prefira pagar à vista com desconto!",
    "Defina um limite mensal para gastos variáveis como lazer e delivery.",
    "Crie o hábito de guardar pelo menos 10% da sua renda todo mês.",
    "Use apps ou planilhas para acompanhar suas entradas e saídas.",
    "Antes de comprar, se pergunte: 'Eu preciso disso agora?'",
    "Tenha uma reserva de emergência com pelo menos 3 meses de despesas.",
    "Evite empréstimos e cheque especial. São armadilhas caríssimas!",
    "Negocie dívidas com desconto à vista sempre que possível.",
    "Reveja seus serviços mensais: dá pra trocar o plano de celular, internet ou streaming?",
    "Faça compras com lista para evitar gastos desnecessários.",
    "Evite pagar o mínimo do cartão para não acumular juros.",
    "Invista em conhecimento financeiro para tomar decisões melhores.",
    "Planeje suas compras sazonais para aproveitar descontos.",
    "Compartilhe seus objetivos financeiros com alguém para se motivar."
  ];

  const categorias = {
    Receita: ["Salário", "Freelancer", "Pix Recebido", "Outros"],
    Despesa: ["Alimentação", "Contas", "Transporte", "Lazer", "Saúde", "Educação", "Compras", "Outros"]
  };

  const tipoSelect = document.getElementById("tipo");
  const categoriaSelect = document.getElementById("categoria");
  const form = document.querySelector("form");
  const lista = document.getElementById("lista-finacas");
  const mensagemVazia = document.getElementById("mensagemVazia");
  const botaoVoltar = document.getElementById("btn-voltar");

  let financas = JSON.parse(localStorage.getItem("financas")) || [];

  if (botaoVoltar) {
    botaoVoltar.addEventListener("click", voltarParaHome);
  }

  exibirDicaFinanceira();
  atualizarCategorias(tipoSelect.value);
  exibirFinancas();

  function exibirDicaFinanceira() {
    const dicaElement = document.getElementById("dica-financeira");
    const dicaAleatoria = dicasFinanceiras[Math.floor(Math.random() * dicasFinanceiras.length)];
    dicaElement.textContent = dicaAleatoria;
  }

  function atualizarCategorias(tipoSelecionado) {
    categoriaSelect.innerHTML = "";
    categorias[tipoSelecionado].forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoriaSelect.appendChild(option);
    });
  }

  tipoSelect.addEventListener("change", () => {
    atualizarCategorias(tipoSelect.value);
  });

  function exibirFinancas() {
    lista.innerHTML = "";

    if (financas.length === 0) {
      mensagemVazia.style.display = "block";
      return;
    }

    mensagemVazia.style.display = "none";

    financas.forEach((financa, index) => {
      const item = document.createElement("li");
      item.className = "mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer";

      const icone = obterIconeCategoria(financa.categoria || 'financeira');

      item.innerHTML = `
    <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
      <div class="flex-1 space-y-2 text-base font-semibold text-black">
        <p>
          <span class="text-pink-500">💼 Tipo:</span> ${financa.tipo}
          <span class="text-pink-500 ml-4">📂 Categoria:</span> ${icone} ${financa.categoria}
        </p>
        <p>
          <span class="text-pink-500">💰 Valor:</span> R$ ${Number(financa.valor).toFixed(2)}
        </p>
        <p>
          <span class="text-pink-500">📅 Data:</span> ${financa.data}
        </p>

        ${financa.observacoes ? `
          <p>
            <span class="text-pink-500">📝 Obs:</span> ${financa.observacoes}
          </p>
        ` : ''}

        ${(financa.lembreteData || financa.lembreteHora) ? `
          <p>
            <span class="text-pink-500">🔔 Lembrete:</span> 
            <span class="text-black">
              ${financa.lembreteData ? new Date(financa.lembreteData).toLocaleDateString('pt-BR') : ''} 
              ${financa.lembreteHora || ''}
            </span>
          </p>
        ` : ''}
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

      lista.appendChild(item);
    });


    // Adiciona os eventos de remoção
    document.querySelectorAll('.btn-remover').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        removerFinanca(index);
      });
    });

    calcularTotais(); // Atualiza os totais sempre que exibir a lista
  }

  function calcularTotais() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    financas.forEach(item => {
      const valor = parseFloat(item.valor) || 0;
      if (item.tipo === "Receita") {
        totalReceitas += valor;
      } else if (item.tipo === "Despesa") {
        totalDespesas += valor;
      }
    });

    const saldo = totalReceitas - totalDespesas;

    document.getElementById("total-receitas").textContent = `R$ ${totalReceitas.toFixed(2)}`;
    document.getElementById("total-despesas").textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.getElementById("saldo").textContent = `R$ ${saldo.toFixed(2)}`;
  }

  function salvarFinancas() {
    localStorage.setItem("financas", JSON.stringify(financas));
  }

  function removerFinanca(index) {
    financas.splice(index, 1);
    salvarFinancas();
    exibirFinancas();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = tipoSelect.value;
    const categoria = categoriaSelect.value;
    const valor = document.getElementById("valor").value.trim();
    const date = form.querySelector("#financeiro-data").value;
    const observacoes = form.querySelector("#observacoes").value.trim();

    if (!categoria || !valor || !date) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    financas.push({ tipo, categoria, valor, data: date, observacoes });

    salvarFinancas();
    exibirFinancas();
    form.reset();
    atualizarCategorias(tipo);
  });

});
