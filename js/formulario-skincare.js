import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';

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
    }

    mensagemVazia.classList.add('hidden');

    skincare.forEach((etapa, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      // Transforma os diasSelecionados em texto bonito para mostrar
      const icone = obterIconeCategoria(etapa.tipo || 'skincare');

      const diasTexto = etapa.diasSelecionados && etapa.diasSelecionados.length > 0
        ? etapa.diasSelecionados.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
        : '-';

      li.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
          <div class="flex-1 space-y-2 text-base font-semibold text-black">
            <p>
              <span class="text-pink-500">🧩 Nome:</span> ${icone} ${etapa.nome}
              <span class="text-pink-500 ml-4">📂 Tipo:</span> ${etapa.tipo}
            </p>
            <p><span class="text-pink-500">📝 Descrição:</span> ${etapa.descricao}</p>
            <p><span class="text-pink-500">📅 Data:</span> ${etapa.data}</p>
            <p><span class="text-pink-500">🔄 Recorrência:</span> ${etapa.recorrencia || '-'}</p>
            <p><span class="text-pink-500">📆 Dias da Semana:</span> ${diasTexto}</p>

            ${etapa.horario ? `<p><span class="text-pink-500">⏱️ Horário:</span> ${etapa.horario}</p>` : ''}
            ${(etapa.lembreteData || etapa.lembreteHora) ? `<p><span class="text-pink-500">🔔 Lembrete:</span> ${etapa.lembreteData || ''} ${etapa.lembreteHora || ''}</p>` : ''}
            ${etapa.alarme ? `<p><span class="text-pink-500">⏰ Alarme:</span> <span class="text-red-600">${etapa.alarme}</span></p>` : ''}
          </div>

          <button 
            class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
            data-index="${index}" 
            title="Remover etapa"
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

  // 💾 SALVA NO LOCALSTORAGE
  function salvarSkincare() {
    localStorage.setItem('skincare', JSON.stringify(skincare));
  }

  // Lógica para habilitar/desabilitar checkboxes dias da semana
  function atualizarDiasSemana() {
    const valor = selectRecorrencia.value;

    if (valor === 'nenhuma') {
      // Desabilita e desmarca todos os dias da semana
      diasSemanaCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true;
        checkbox.parentElement.classList.add('opacity-50', 'cursor-not-allowed');
      });
    } else {
      // Habilita os checkboxes para permitir seleção
      diasSemanaCheckboxes.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.parentElement.classList.remove('opacity-50', 'cursor-not-allowed');
      });
    }
  }

  // Atualiza os dias da semana ao mudar a recorrência
  if (selectRecorrencia) {
    selectRecorrencia.addEventListener('change', atualizarDiasSemana);
    atualizarDiasSemana(); // chama no carregamento da página
  }

  // ✅ FORMULÁRIO - ADICIONAR ETAPA
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('consulta-etapa').value.trim();
    const descricao = document.getElementById('consulta-observacoes').value.trim();
    const tipo = document.getElementById('consulta-tipo-produto').value;
    const data = document.getElementById('consulta-data').value;
    const recorrencia = selectRecorrencia.value;

    // Pega os dias selecionados num array
    const diasSelecionados = Array.from(diasSemanaCheckboxes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);

    const horario = document.getElementById('consulta-horario').value;
    const lembreteData = document.getElementById('consulta-lembrete-data').value;
    const lembreteHora = document.getElementById('consulta-lembrete-hora').value;
    const alarme = document.getElementById('consulta-alarme').value;

    if (!nome || !tipo || !data) {
      alert('Por favor, preencha os campos obrigatórios: etapa, tipo e data.');
      return;
    }

    const novaEtapa = {
      nome,
      descricao,
      tipo,
      data,
      recorrencia,
      diasSelecionados,
      horario,
      lembreteData,
      lembreteHora,
      alarme,
      title: `Skincare: ${nome || 'Sem título'}`
    };


    skincare.push(novaEtapa);
    salvarSkincare();

    form.reset();

    // Atualiza os dias da semana **somente se a recorrência atual exigir**
    if (selectRecorrencia.value === 'nenhuma' || selectRecorrencia.value === 'diaria') {
      atualizarDiasSemana();
    } else {
      // Se for semanal, quinzenal, mensal: habilita os checkboxes
      diasSemanaCheckboxes.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.parentElement.classList.remove('opacity-50', 'cursor-not-allowed');
      });
    }

    renderizarSkincare();
  });

  // Botão voltar
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }

  // Inicializa renderização
  renderizarSkincare();
});

// 💡 DICAS INSPIRADORAS DE SKINCARE (fica aqui fora)
const dicasSkincare = [
  "Cuidar da pele é um ato de amor próprio 💆‍♀️",
  "Não esqueça do protetor solar, mesmo em dias nublados ☁️☀️",
  "Hidrate a pele diariamente para manter o viço e saúde 💧",
  "Limpe o rosto antes de dormir para evitar cravos e espinhas 🧼",
  "Evite produtos com álcool em excesso para não ressecar a pele ❌",
  "Beba bastante água para manter a pele hidratada 💦",
  "Esfolie a pele 1-2x por semana para renovar as células 🧽",
  "Durma bem para que a pele se regenere durante a noite 😴",
  "Use produtos adequados pro seu tipo de pele 🧴",
  "Evite tocar no rosto com mãos sujas 🖐️"
];

function mostrarDica() {
  const dica = dicasSkincare[Math.floor(Math.random() * dicasSkincare.length)];
  const elementoDica = document.getElementById('dica-saude');
  if (elementoDica) elementoDica.textContent = dica;
}

window.addEventListener('load', mostrarDica);
