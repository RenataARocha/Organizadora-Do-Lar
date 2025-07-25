import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener("DOMContentLoaded", () => {

  let limitesOrcamento = JSON.parse(localStorage.getItem("limitesOrcamento")) || {};

  const categoriasDisponiveis = ["Alimentação", "Transporte", "Saúde", "Lazer", "Educação", "Contas", "Compras", "Outros"];
  const containerOrcamento = document.getElementById("lista-orcamentos");
  const btnSalvarOrcamento = document.getElementById("salvar-orcamento");

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

  // NOVOS filtros
  const filtroTipo = document.getElementById("filtro-tipo");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const filtroData = document.getElementById("filtro-data");

  let financas = JSON.parse(localStorage.getItem("financas")) || [];
  financas = financas.filter(f => !isNaN(parseFloat(f.valor)));
  localStorage.setItem("financas", JSON.stringify(financas));

  processarRecorrencias();


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

  // Escutadores dos filtros para atualizar a lista na hora
  filtroTipo.addEventListener("change", exibirFinancas);
  filtroCategoria.addEventListener("change", exibirFinancas);
  filtroData.addEventListener("change", exibirFinancas);


  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = tipoSelect.value;
    const categoria = categoriaSelect.value;
    const valor = document.getElementById("valor").value.trim();
    const data = document.getElementById("financeiro-data").value;
    const observacoes = document.getElementById("observacoes").value.trim();
    const recorrencia = document.getElementById("recorrencia").value;
    const metodoPagamento = document.getElementById("metodo-pagamento").value;

    if (!metodoPagamento) {
      alert("Selecione um método de pagamento!");
      return;
    }

    if (!categoria || !valor || !data) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorNumerico)) {
      alert("Valor inválido! Digite um número válido com ponto ou vírgula.");
      return;
    }

    if (tipo === "Despesa" && limitesOrcamento[categoria]) {
      const totalCategoria = calcularTotalPorCategoria(categoria) + valorNumerico;

      if (totalCategoria > limitesOrcamento[categoria]) {
        alert(`🚨 Atenção! Você ultrapassou o orçamento de R$ ${limitesOrcamento[categoria].toFixed(2)} para ${categoria}. Total atual com essa despesa: R$ ${totalCategoria.toFixed(2)}.`);
      }
    }

    const icone = obterIconeCategoria(categoria);

    const isRecorrente = recorrencia && recorrencia !== "Nenhuma";

    const proximaOcorrencia = isRecorrente
      ? calcularProximaOcorrencia(data, recorrencia)
      : null;

    financas.push({
      tipoFinanceiro: tipo,
      categoria,
      valor: valorNumerico,
      data,
      observacoes,
      recorrencia,
      proximaOcorrencia,
      titulo: `${icone} ${categoria}`,
      metodoPagamento,

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

    // Captura valores dos filtros
    const tipoFiltro = filtroTipo.value;
    const categoriaFiltro = filtroCategoria.value;
    const dataFiltro = filtroData.value;

    // Copia a lista original
    let financasFiltradas = [...financas];

    // Filtro por tipo (Receita ou Despesa)
    if (tipoFiltro) {
      financasFiltradas = financasFiltradas.filter(f => f.tipoFinanceiro === tipoFiltro);
    }

    // Filtro por categoria
    if (categoriaFiltro) {
      financasFiltradas = financasFiltradas.filter(f => f.categoria === categoriaFiltro);
    }

    // Filtro por mês/ano
    if (dataFiltro) {
      const [anoFiltro, mesFiltro] = dataFiltro.split("-").map(Number);

      financasFiltradas = financasFiltradas.filter(f => {
        let dataFinanca;
        if (f.data.includes("/")) {
          // dd/mm/yyyy -> yyyy-mm-dd
          const [dia, mes, ano] = f.data.split("/").map(Number);
          dataFinanca = new Date(ano, mes - 1, dia);
        } else {
          const [ano, mes, dia] = f.data.split("-").map(Number);
          dataFinanca = new Date(ano, mes - 1, dia);
        }

        return (
          dataFinanca.getFullYear() === anoFiltro &&
          dataFinanca.getMonth() + 1 === mesFiltro
        );
      });
    }

    // Se não houver filtro definido, mostra só o mês atual
    if (!dataFiltro) {
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      financasFiltradas = financasFiltradas.filter(f => {
        const dataFinanca = new Date(normalizarParaISO(f.data));
        return dataFinanca.getMonth() === mesAtual && dataFinanca.getFullYear() === anoAtual;
      });
    }

    // Se não houver nada, mostra mensagem fofa
    if (financasFiltradas.length === 0) {
      mensagemVazia.style.display = "block";
      return;
    } else {
      mensagemVazia.style.display = "none";
    }

    // Monta os itens
    financasFiltradas.forEach((financa, index) => {
      const item = document.createElement("li");
      item.className = "mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer";

      item.innerHTML = `
      <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
        <div class="flex-1 space-y-2 text-base font-semibold text-black">
          ${formatarExibicao(financa, 'financa')}
        </div>
        <button
          class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
          data-index="${financas.indexOf(financa)}"
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

    // Botões de remover
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

  function calcularTotalPorCategoria(categoria) {
    return financas
      .filter(f => f.tipoFinanceiro === "Despesa" && f.categoria === categoria)
      .reduce((total, f) => total + parseFloat(f.valor), 0);
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
          backgroundColor: ['#f85199', '#93c5fd', '#ffff00', '#86efac', '#c4b5fd', '#f9a8d4', '#a5b4fc']
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

  // Salva os limites no localStorage
  btnSalvarOrcamento.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".orcamento-input");
    inputs.forEach(input => {
      const categoria = input.getAttribute("data-categoria");
      const valor = parseFloat(input.value.replace(",", ".")) || 0;
      limitesOrcamento[categoria] = valor;
    });

    localStorage.setItem("limitesOrcamento", JSON.stringify(limitesOrcamento));
    alert("✅ Orçamentos atualizados com sucesso!");
  });


  function carregarOrcamentos() {
    containerOrcamento.innerHTML = "";
    categoriasDisponiveis.forEach(cat => {
      const valorAtual = limitesOrcamento[cat] || "";
      const campo = document.createElement("div");
      campo.className = "flex flex-col mb-2";

      campo.innerHTML = `
      <label class="font-medium text-gray-700 mb-1">${cat}</label>
      <input type="number" min="0" step="0.01" data-categoria="${cat}" placeholder="R$ 0,00"
        class="orcamento-input px-3 py-2 border-2 border-pink-300 rounded-lg bg-stone-50 text-gray-700 transition duration-300 ease-in-out focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
        value="${valorAtual}">
    `;

      containerOrcamento.appendChild(campo);
    });
  }

  carregarOrcamentos();


  function carregarFiltroCategorias() {
    filtroCategoria.innerHTML = '<option value="">Todas as categorias</option>';
    const todasCategorias = [...new Set([...categorias.Receita, ...categorias.Despesa])];
    todasCategorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filtroCategoria.appendChild(option);
    });
  }

  carregarFiltroCategorias();


  // Função para exportar os dados para CSV
  function exportarCSV() {
    if (financas.length === 0) {
      alert("Não há dados para exportar! 🥺");
      return;
    }

    // Cabeçalho do CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tipo,Categoria,Valor,Data,Método de Pagamento,Observações\n";


    // Dados
    financas.forEach(f => {
      csvContent += `${f.tipoFinanceiro},${f.categoria},${f.valor},${f.data},${f.metodoPagamento},${f.observacoes || ""}\n`;
    });

    // Cria o arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Baixa o arquivo
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "financas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Evento do botão
  document.getElementById("btn-exportar").addEventListener("click", exportarCSV);

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
      case "Diária":
        d.setDate(d.getDate() + 1);
        break;
      case "Semanal":
        d.setDate(d.getDate() + 7);
        break;
      case "Quinzenal":
        d.setDate(d.getDate() + 15);
        break;
      case "Mensal":
        d.setMonth(d.getMonth() + 1);
        break;
      case "Anual":
        d.setFullYear(d.getFullYear() + 1);
        break;
      default:
        return null;
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

  function cloneFinanca(financa, novaDataISO) {
    return {
      ...financa,
      data: novaDataISO,
      recorrente: false,
      proximaOcorrencia: null
    };
  }

  function processarRecorrencias() {
    let alterou = false;
    const limite = 200; // segurança
    financas.forEach((f) => {
      if (!f.recorrencia || f.recorrencia === "Nenhuma" || !f.proximaOcorrencia) return;

      let count = 0;
      while (isPastOrToday(f.proximaOcorrencia) && count < limite) {
        const nova = cloneFinanca(f, f.proximaOcorrencia);
        financas.push(nova);
        f.proximaOcorrencia = calcularProximaOcorrencia(f.proximaOcorrencia, f.recorrencia);
        alterou = true;
        count++;
      }
    });

    if (alterou) salvarFinancas();
  }

});
