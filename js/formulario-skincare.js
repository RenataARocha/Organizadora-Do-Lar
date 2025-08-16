import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

document.addEventListener('DOMContentLoaded', () => {
  initLembretes('skincare', 'lista-skincare', 'mensagemVazia');

  // 🌟 ELEMENTOS DO DOM
  const form = document.getElementById('form-skincare');
  const lista = document.getElementById('lista-skincare');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const botaoVoltar = document.getElementById('btn-voltar');

  const selectRecorrencia = document.getElementById('consulta-recorrencia');
  const diasSemanaCheckboxes = document.querySelectorAll('input[name="dias-semana"]');

  // 💾 PEGA DO LOCALSTORAGE
  let skincare = JSON.parse(localStorage.getItem('skincare')) || [];

  // 🔄 FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO
  function renderizarSkincare() {
    lista.innerHTML = '';

    if (skincare.length === 0) {
      mensagemVazia.classList.remove('hidden');
      return;
    } else {
      mensagemVazia.classList.add('hidden');
    }

    skincare.forEach((etapa, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      const categoria = etapa.tipo || 'skincare';
      const icone = obterIconeCategoria(categoria, 'skincare');

      const diasTexto = etapa.diasSelecionados && etapa.diasSelecionados.length > 0
        ? etapa.diasSelecionados.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
        : '-';

      li.innerHTML = `
      <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
        <div class="flex-1 space-y-2 text-base font-semibold text-black">
          ${formatarExibicao({
        ...etapa,
        titulo: `${icone} ${etapa.nome}`,
        diasTexto
      }, 'etapa')}
        </div>
        <div class="flex flex-col items-end gap-2">
          <button
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden"
      data-index="${index}"
      title="Remover tarefa"
      type="button"
    >
      Remover
      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
        style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
      </span>
    </button>
    <button
                class="relative bg-pink-400 text-white h-fit py-2 pr-12 pl-7 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden btn-editar"
                data-index="${index}"
                title="Editar tarefa"
                type="button"
              >
                Editar
              <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
          style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;
        </span>
              </button>
        </div>
      </div>
    `;

      lista.appendChild(li);
    });

    adicionarEventosRemocao();
    adicionarEventosEdicao();
  }

  // ❌ EVENTO DE REMOÇÃO
  function adicionarEventosRemocao() {
    const botoesRemover = document.querySelectorAll('.btn-remover');
    botoesRemover.forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        skincare.splice(index, 1);
        salvarSkincare();
        renderizarSkincare();
      });
    });
  }

  function adicionarEventosEdicao() {
    const botoesEditar = document.querySelectorAll('.btn-editar');
    botoesEditar.forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const etapa = skincare[index];
        if (!etapa) return;

        // Preenche o formulário com os valores atuais
        document.getElementById('consulta-etapa').value = etapa.nome;
        document.getElementById('consulta-observacoes').value = etapa.descricao || '';
        document.getElementById('consulta-tipo-produto').value = etapa.tipo;
        document.getElementById('consulta-data').value = etapa.data;
        selectRecorrencia.value = etapa.recorrencia;
        atualizarDiasSemana();

        // Marca os checkboxes dos dias selecionados
        diasSemanaCheckboxes.forEach(chk => {
          chk.checked = etapa.diasSelecionados?.includes(chk.value) || false;
        });

        document.getElementById('consulta-horario').value = etapa.horario || '';
        document.getElementById('consulta-lembrete-data').value = etapa.lembreteData || '';
        document.getElementById('consulta-lembrete-hora').value = etapa.lembreteHora || '';
        document.getElementById('consulta-alarme').value = etapa.alarme || '';

        form.dataset.editIndex = index;
        form.dataset.editing = "true";
        form.querySelector('button[type="submit"]').textContent = "Atualizar Etapa";
        mensagemVazia.classList.add('hidden');
      });
    });
  }
  adicionarEventosEdicao();


  // 💾 SALVA NO LOCALSTORAGE
  function salvarSkincare() {
    localStorage.setItem('skincare', JSON.stringify(skincare));
  }

  // Lógica para habilitar/desabilitar checkboxes dias da semana
  function atualizarDiasSemana() {
    const valor = selectRecorrencia.value;

    if (valor === 'nenhuma') {
      diasSemanaCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true;
        checkbox.parentElement.classList.add('opacity-50', 'cursor-not-allowed');
      });
    } else {
      diasSemanaCheckboxes.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.parentElement.classList.remove('opacity-50', 'cursor-not-allowed');
      });
    }
  }

  // Atualiza os dias da semana ao mudar a recorrência
  if (selectRecorrencia) {
    selectRecorrencia.addEventListener('change', atualizarDiasSemana);
    atualizarDiasSemana();
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // ✅ FORMULÁRIO - ADICIONAR ETAPA
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('consulta-etapa').value.trim();
    const descricao = document.getElementById('consulta-observacoes').value.trim();
    const tipoProduto = document.getElementById('consulta-tipo-produto').value;
    const data = document.getElementById('consulta-data').value;
    const recorrencia = selectRecorrencia.value;

    const diasSelecionados = Array.from(diasSemanaCheckboxes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);

    const horario = document.getElementById('consulta-horario').value;
    const lembreteData = document.getElementById('consulta-lembrete-data').value;
    const lembreteHora = document.getElementById('consulta-lembrete-hora').value;
    const alarme = document.getElementById('consulta-alarme').value;

    if (!nome || !tipoProduto || !data) {
      alert('Por favor, preencha os campos obrigatórios: etapa, tipo e data.');
      return;
    }

    const novaEtapa = {
      nome,
      descricao,
      tipo: tipoProduto,
      data,
      recorrencia,
      diasSelecionados,
      horario,
      lembreteData,
      lembreteHora,
      alarme,
      titulo: `${obterIconeCategoria('Skincare')} ${capitalize(nome)}`
    };
    if (form.dataset.editIndex !== undefined) {
      const idx = parseInt(form.dataset.editIndex, 10);
      skincare[idx] = novaEtapa; // substitui a etapa existente
      delete form.dataset.editIndex;
      delete form.dataset.editing;
      form.querySelector('button[type="submit"]').textContent = "Adicionar Etapa";
    } else {
      skincare.push(novaEtapa);
    }

    salvarSkincare();
    form.reset();
    atualizarDiasSemana();
    renderizarSkincare();
  });

  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }

  renderizarSkincare();
});

// 💡 DICAS INSPIRADORAS DE SKINCARE
const dicasSkincare = [
  "Evite exposição excessiva ao sol entre 10h e 16h 🌞",
  "Use chapéu e óculos escuros para proteção extra 🧢🕶️",
  "Inclua alimentos ricos em antioxidantes na dieta 🥦🍓",
  "Evite dormir maquiada para prevenir irritações e cravos 💄🚫",
  "Massageie o rosto ao aplicar o hidratante para melhorar a circulação ✋",
  "Troque fronhas e toalhas com frequência para evitar bactérias 🛏️🧴",
  "Evite banhos muito quentes para não ressecar a pele 🚿🔥",
  "Invista em um bom tônico facial para equilibrar o pH da pele 🧴",
  "Faça limpeza facial profissional periodicamente 🧖‍♀️",
  "Cuide da pele do pescoço e colo, que também envelhecem 👸",
  "Proteja os lábios com hidratante labial e filtro solar 💋",
  "Use produtos naturais, sempre que possível, para evitar alergias 🌿",
  "Evite estresse excessivo, pois ele afeta diretamente a pele 😌",
  "Inclua exercícios físicos na rotina para melhorar a circulação sanguínea 🏃‍♀️",
  "Beba chá verde, ótimo para a saúde da pele e antioxidante 🍵",
  "Consulte um dermatologista regularmente para cuidar da sua pele com segurança 🩺",
  "Evite fumar, pois prejudica a elasticidade e coloração da pele 🚭",
  "Aposte em máscaras faciais hidratantes ou purificantes semanalmente 🧖‍♀️",
  "Proteja a pele das agressões ambientais, como poluição e vento 🌬️🌫️",
  "Mantenha uma rotina constante, a pele agradece a disciplina! 💪"
];

function mostrarDica() {
  const dica = dicasSkincare[Math.floor(Math.random() * dicasSkincare.length)];
  const elementoDica = document.getElementById('dica-saude');
  if (elementoDica) elementoDica.textContent = dica;
}

window.addEventListener('load', mostrarDica);
