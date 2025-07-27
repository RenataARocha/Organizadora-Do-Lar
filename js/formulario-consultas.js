import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener('DOMContentLoaded', () => {
  initLembretes('consultas', 'lista-consultas', 'mensagemVazia');

  const form = document.getElementById('form-consultas');
  const listaConsultas = document.getElementById('lista-consultas');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const dicaSaude = document.getElementById('dica-saude');
  const botaoVoltar = document.getElementById('btn-voltar');

  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }

  atualizarRecorrencias();
  carregarConsultas();
  gerarDicaSaude();

  // Adiciona dias, semanas, etc.
  function adicionarTempo(dataStr, recorrencia) {
    const data = new Date(dataStr);
    switch (recorrencia.toLowerCase()) {
      case "diária": data.setDate(data.getDate() + 1); break;
      case "semanal": data.setDate(data.getDate() + 7); break;
      case "quinzenal": data.setDate(data.getDate() + 15); break;
      case "mensal": data.setMonth(data.getMonth() + 1); break;
      case "anual": data.setFullYear(data.getFullYear() + 1); break;
      default: break;
    }
    return data.toISOString().slice(0, 10);
  }

  // Atualiza datas recorrentes automaticamente
  function atualizarRecorrencias() {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const hoje = new Date().toISOString().slice(0, 10);
    let alterou = false;

    consultas.forEach(consulta => {
      if (consulta.repeticao && consulta.repeticao.toLowerCase() !== "nenhuma") {
        if (consulta.data <= hoje) {
          consulta.data = adicionarTempo(consulta.data, consulta.repeticao);
          if (consulta.lembreteData && consulta.lembreteData <= hoje) {
            consulta.lembreteData = adicionarTempo(consulta.lembreteData, consulta.repeticao);
          }
          alterou = true;
        }
      }
    });

    if (alterou) {
      localStorage.setItem('consultas', JSON.stringify(consultas));
    }
  }

  function salvarConsulta(consulta) {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));
  }

  function carregarConsultas() {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    listaConsultas.innerHTML = '';

    if (consultas.length === 0) {
      mensagemVazia.style.display = 'block';
      return;
    }

    mensagemVazia.style.display = 'none';

    consultas.forEach((consulta, index) => {
      const li = document.createElement('li');
      li.classList.add(
        "mb-3", "p-3", "rounded-lg", "shadow",
        "bg-purple-50", "hover:bg-rose-50", "cursor-pointer"
      );

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      ${formatarExibicao({
        ...consulta,
        titulo: `${obterIconeCategoria(consulta.tipo?.toLowerCase() || 'consulta')} ${consulta.nome}`,
        hora: consulta.horario
      }, consulta.tipo?.toLowerCase() || 'consulta')}
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover consulta"
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
      listaConsultas.appendChild(li);
    });

    document.querySelectorAll('.btn-remover').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.currentTarget.dataset.index;
        removerConsulta(index);
      });
    });
  }

  function removerConsulta(index) {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.splice(index, 1);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    carregarConsultas();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const novaConsulta = {
      nome: document.getElementById('consulta-nome').value,
      descricao: document.getElementById('consulta-descricao').value,
      tipo: document.getElementById('selectTipoConsulta').value,
      data: document.getElementById('inputDataConsulta').value,
      horario: document.getElementById('inputHorarioConsulta').value,
      local: document.getElementById('inputLocalConsulta').value,
      observacoes: document.getElementById('inputObservacoes').value,
      repeticao: document.getElementById('consulta-repeticao').value,
      lembreteData: document.getElementById('consulta-reminder-date').value,
      lembreteHora: document.getElementById('consulta-reminder-time').value,
      title: `Consulta: ${document.getElementById('consulta-nome').value}`,
    };

    salvarConsulta(novaConsulta);
    form.reset();
    carregarConsultas();
  });

  function gerarDicaSaude() {
    const dicas = [
      "Beba bastante água durante o dia!",
      "Faça pausas durante o uso prolongado do computador.",
      "Alimente-se com frutas e verduras diariamente.",
      "Durma pelo menos 7-8 horas por noite.",
      "Exercite-se regularmente, mesmo que por 30 minutos.",
      "Evite o excesso de açúcar e alimentos processados.",
      "Mantenha sua vacinação em dia.",
      "Cuide da saúde mental: respire fundo e desacelere.",
      "Evite o uso excessivo de telas antes de dormir.",
      "Faça exames preventivos regularmente!",
      "Inclua fibras nas suas refeições para melhorar a digestão.",
      "Pratique exercícios de alongamento ao acordar.",
      "Prefira alimentos frescos e naturais sempre que possível.",
      "Reduza o consumo de sal para cuidar do coração.",
      "Faça caminhadas ao ar livre para renovar as energias.",
      "Lembre-se de lavar as mãos com frequência.",
      "Evite fumar e o consumo excessivo de álcool.",
      "Reserve um momento do dia para meditar ou relaxar.",
      "Mantenha uma postura correta para evitar dores nas costas.",
      "Evite comer muito tarde para ter uma boa noite de sono.",
    ];

    dicaSaude.textContent = dicas[Math.floor(Math.random() * dicas.length)];
  }
});
