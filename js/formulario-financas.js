import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener("DOMContentLoaded", () => {
  const dicasFinanceiras = [
    "Anote todos os seus gastos, até os pequenos!",
    "Economize 10% de tudo que ganhar!",
    "Evite parcelamentos longos.",
    "Use planilhas ou apps para ter controle.",
    "Gaste menos do que ganha. Simples assim.",
    "Tenha uma reserva de emergência!",
    "Pense antes de comprar: você realmente precisa disso?",
    "Compare preços antes de fechar a compra.",
    "Evite pagar o mínimo do cartão de crédito!",
    "Invista seu dinheiro para fazer ele trabalhar por você.",
    "Corte gastos desnecessários e reinvista em você.",
    "Tenha metas financeiras claras e mensuráveis.",
    "Dinheiro não aceita desaforo: cuide bem dele!",
    "Organize seu mês antes dele começar.",
    "Dê um nome a cada real que você recebe.",
    "Seu 'eu do futuro' vai agradecer suas escolhas de hoje!",
    "Finanças saudáveis, mente leve!",
    "Use o cartão de crédito com inteligência, não por impulso.",
    "Controle é liberdade: saiba onde vai cada centavo.",
    "Mais importante que ganhar bem é saber administrar bem."
  ];

  const categorias = {
    Receita: ["Salário", "Freelancer", "Pix Recebido", "Outros"],
    Despesa: ["Alimentação", "Contas", "Transporte", "Lazer", "Saúde", "Educação", "Compras", "Outros"]
  };

  const tipoSelect = document.getElementById("tipo");
  const categoriaSelect = document.getElementById("categoria");
  const form = document.getElementById("form-financeiro");
  const lista = document.getElementById("lista-finacas");
  const mensagemVazia = document.getElementById("mensagemVazia");
  const botaoVoltar = document.getElementById("btn-voltar");

  let financas = JSON.parse(localStorage.getItem("financas")) || [];
  financas = financas.filter(f => !isNaN(parseFloat(f.valor)));
  localStorage.setItem("financas", JSON.stringify(financas));
  let graficoPizza = null;
  let ctx = null;

  if (botaoVoltar) {
    botaoVoltar.addEventListener("click", voltarParaHome);
  }

  exibirDicaFinanceira();
  atualizarCategorias(tipoSelect.value);
  exibirFinancas();
  inicializarGrafico();

  tipoSelect.addEventListener("change", () => {
    atualizarCategorias(tipoSelect.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = tipoSelect.value;
    const categoria = categoriaSelect.value;
    const valor = document.getElementById("valor").value.trim();
    const data = document.getElementById("financeiro-data").value;
    const observacoes = document.getElementById("observacoes").value.trim();

    if (!categoria || !valor || !data) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorNumerico)) {
      alert("Valor inválido! Digite um número válido com ponto ou vírgula.");
      return;
    }


    const icone = obterIconeCategoria(categoria);

    financas.push({
      tipoFinanceiro: tipo,
      categoria,
      valor: valorNumerico,
      data,
      observacoes,
      titulo: `${icone} ${categoria}`
    });


    salvarFinancas();
    exibirFinancas();
    atualizarGrafico();

    form.reset();
    atualizarCategorias(tipo);
  });

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

      item.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
          <div class="flex-1 space-y-2 text-base font-semibold text-black">
            ${formatarExibicao(financa, 'financa')}
          </div>
          <button
            class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
            data-index="${index}"
            title="Remover entrada"
            type="button">
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

    document.querySelectorAll('.btn-remover').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        removerFinanca(index);
      });
    });

    calcularTotais();
  }

  function calcularTotais() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    financas.forEach(item => {
      const valor = parseFloat(item.valor) || 0;
      if (item.tipoFinanceiro === "Receita") {
        totalReceitas += valor;
      } else if (item.tipoFinanceiro === "Despesa") {
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
    atualizarGrafico();
  }

  function inicializarGrafico() {
    const canvas = document.getElementById("grafico-pizza");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    atualizarGrafico();
  }

  function atualizarGrafico() {
    const despesas = financas.filter(f => f.tipoFinanceiro === "Despesa");
    const categoriasValores = {};

    despesas.forEach(d => {
      const valorDespesa = parseFloat(d.valor);
      if (!isNaN(valorDespesa)) {
        categoriasValores[d.categoria] = (categoriasValores[d.categoria] || 0) + valorDespesa;
      }
    });

    if (graficoPizza) {
      graficoPizza.destroy();
    }

    if (Object.keys(categoriasValores).length === 0) {
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    graficoPizza = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categoriasValores),
        datasets: [{
          label: "Despesas por Categoria",
          data: Object.values(categoriasValores),
          backgroundColor: ['#f85199', '#93c5fd', '#ffff00', '##86efac', '#c4b5fd', '#f9a8d4', '#a5b4fc']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

});
