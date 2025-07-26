document.addEventListener("DOMContentLoaded", () => {
    const resumoMensalDiv = document.getElementById("resumo-mensal");
    const badgeConquista = document.getElementById("badge-conquista");
    const ctxOrcamento = document.getElementById("grafico-orcamento")?.getContext("2d");

    let graficoOrcamento = null;

    let financas = JSON.parse(localStorage.getItem("financas")) || [];
    let limitesOrcamento = JSON.parse(localStorage.getItem("limitesOrcamento")) || {};

    console.log("[HISTÓRICO] financas carregadas:", financas);

    // Cores diferentes pra cada categoria no orçamento
    const coresCategorias = [
        "#f87171", // vermelho
        "#4ade80", // verde
        "#60a5fa", // azul
        "#fbbf24", // amarelo
        "#a78bfa", // roxo
        "#f472b6", // rosa
        "#34d399", // verde-água
        "#fb923c", // laranja
    ];

    function normalizarParaISO(str) {
        if (!str) return null;
        if (str.includes("/")) {
            const [d, m, y] = str.split("/").map(Number);
            return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        }
        return str; // já tá em yyyy-mm-dd
    }

    function toDateSafe(str) {
        const iso = normalizarParaISO(str);
        return iso ? new Date(iso) : new Date(NaN);
    }

    function atualizarHistorico() {
        const { totalReceitas, totalDespesas, saldo } = calcularResumoMensal();

        resumoMensalDiv.innerHTML = `
      <div class="p-4 bg-pink-50 rounded-lg shadow flex justify-between items-center mb-2">
        <span class="font-semibold text-gray-700">Receitas:</span>
        <span class="text-green-700 font-bold">R$ ${totalReceitas.toFixed(2)}</span>
      </div>
      <div class="p-4 bg-pink-50 rounded-lg shadow flex justify-between items-center mb-2">
        <span class="font-semibold text-gray-700">Despesas:</span>
        <span class="text-red-700 font-bold">R$ ${totalDespesas.toFixed(2)}</span>
      </div>
      <div class="p-4 bg-pink-50 rounded-lg shadow flex justify-between items-center">
        <span class="font-semibold text-gray-700">Saldo:</span>
        <span class="${saldo >= 0 ? 'text-green-700' : 'text-red-700'} font-bold">R$ ${saldo.toFixed(2)}</span>
      </div>
    `;

        exibirBadge(saldo);
        atualizarGraficoOrcamento();
    }

    function calcularResumoMensal() {
        const hoje = new Date();
        const mesAtual = hoje.getUTCMonth();
        const anoAtual = hoje.getUTCFullYear();

        const financasDoMes = financas.filter(f => {
            const d = toDateSafe(f.data);
            return !isNaN(d) && d.getUTCMonth() === mesAtual && d.getUTCFullYear() === anoAtual;
        });

        console.log("[HISTÓRICO] financasDoMes:", financasDoMes);

        let totalReceitas = 0;
        let totalDespesas = 0;

        financasDoMes.forEach(item => {
            const valor = parseFloat(item.valor) || 0;
            if (item.tipoFinanceiro === "Receita") totalReceitas += valor;
            if (item.tipoFinanceiro === "Despesa") totalDespesas += valor;
        });

        return { totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas };
    }

    function exibirBadge(saldo) {
        if (saldo > 0) {
            badgeConquista.textContent = "Mestra do Controle 💎";
            badgeConquista.classList.add("text-green-600");
            badgeConquista.classList.remove("text-red-600");
        } else {
            badgeConquista.textContent = "Fique de olho no orçamento! ⚠️";
            badgeConquista.classList.add("text-red-600");
            badgeConquista.classList.remove("text-green-600");
        }
    }

    function atualizarGraficoOrcamento() {
        if (!ctxOrcamento) return;

        const categorias = Object.keys(limitesOrcamento);
        if (categorias.length === 0) {
            limitesOrcamento = {
                "Exemplo": 0
            };
        }

        const gastos = categorias.map(cat => calcularTotalPorCategoriaMesAtual(cat));

        if (graficoOrcamento) graficoOrcamento.destroy();

        graficoOrcamento = new Chart(ctxOrcamento, {
            type: "bar",
            data: {
                labels: categorias,
                datasets: [
                    {
                        label: "Orçamento",
                        data: categorias.map(cat => limitesOrcamento[cat] || 0),
                        backgroundColor: categorias.map((_, i) => coresCategorias[i % coresCategorias.length]),
                    },
                    {
                        label: "Gastos (mês atual)",
                        data: gastos,
                        backgroundColor: categorias.map((_, i) => {
                            const g = gastos[i];
                            const limite = limitesOrcamento[categorias[i]] || 0;
                            return g > limite ? "#f87171" : coresCategorias[i % coresCategorias.length];
                        }),
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
                plugins: {
                    legend: { position: "bottom" },
                },
            },
        });
    }

    function calcularTotalPorCategoriaMesAtual(categoria) {
        const hoje = new Date();
        const mesAtual = hoje.getUTCMonth();
        const anoAtual = hoje.getUTCFullYear();

        return financas
            .filter(f =>
                f.tipoFinanceiro === "Despesa" &&
                f.categoria === categoria &&
                (() => {
                    const d = toDateSafe(f.data);
                    return !isNaN(d) && d.getUTCMonth() === mesAtual && d.getUTCFullYear() === anoAtual;
                })()
            )
            .reduce((total, f) => total + (parseFloat(f.valor) || 0), 0);
    }

    atualizarHistorico();

    setInterval(atualizarHistorico, 60000);

    const btnVoltar = document.getElementById("btn-voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            window.location.href = "../pages/tela-inicial.html";
        });
    }

});
