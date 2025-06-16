document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-skincare');
  const lista = document.getElementById('lista-skincare');
  const mensagemVazia = document.getElementById('mensagemVazia');

  let skincare = JSON.parse(localStorage.getItem('skincare')) || [];

  const renderizarSkincare = () => {
    lista.innerHTML = '';

    if (skincare.length === 0) {
      mensagemVazia.style.display = 'block';
      return;
    }
    mensagemVazia.style.display = 'none';

    skincare.forEach((etapa, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
    <div class="flex-1 space-y-1">
      <p class="text-base font-semibold">
        <span class="text-pink-500">Nome:</span>
        <span class="text-black">${etapa.nome}</span>
        <span class="text-pink-500 ml-4">Tipo:</span>
        <span class="text-black">${etapa.tipo}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Descrição:</span>
        <span class="text-black">${etapa.descricao}</span>
      </p>
      <p class="text-base font-semibold">
        <span class="text-pink-500">Data:</span>
        <span class="text-black">${etapa.data}</span>
      </p>
      ${etapa.horario ? `
      <p class="text-base font-semibold">
        <span class="text-pink-500">Horário:</span>
        <span class="text-black">${etapa.horario}</span>
      </p>` : ''}
      ${(etapa.lembreteData || etapa.lembreteHora) ? `
      <p class="text-base font-semibold">
        <span class="text-pink-500">🔔 Lembrete:</span>
        <span class="text-black">${etapa.lembreteData || ''} ${etapa.lembreteHora || ''}</span>
      </p>` : ''}
      ${etapa.alarme ? `
      <p class="text-base font-semibold">
        <span class="text-pink-500">⏰ Alarme:</span>
        <span class="text-black font-semibold text-red-600">${etapa.alarme}</span>
      </p>` : ''}
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover etapa"
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

    // Depois que a lista tá renderizada, adiciona os eventos aos botões
    const botoesRemover = document.querySelectorAll('.btn-remover');
    botoesRemover.forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        skincare.splice(index, 1);
        localStorage.setItem('skincare', JSON.stringify(skincare));
        renderizarSkincare();
      });
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('consulta-nome').value.trim();
    const descricao = document.getElementById('consulta-descricao').value.trim();
    const tipo = document.getElementById('selectTipoConsulta').value;
    const data = document.getElementById('inputDataConsulta').value;
    const horario = document.getElementById('inputHorarioConsulta').value;
    const lembreteData = document.getElementById('consulta-reminder-date').value;
    const lembreteHora = document.getElementById('consulta-reminder-time').value;
    const alarme = document.getElementById('task-alarm').value;

    if (!nome || !tipo || !data) {
      alert('Por favor, preencha os campos obrigatórios: nome, tipo e data.');
      return;
    }

    const novaEtapa = {
      nome,
      descricao,
      tipo,
      data,
      horario,
      lembreteData,
      lembreteHora,
      alarme
    };

    skincare.push(novaEtapa);
    localStorage.setItem('skincare', JSON.stringify(skincare));
    form.reset();
    renderizarSkincare();
  });

  // Renderiza a lista quando a página carrega
  renderizarSkincare();
});

// Dica de skincare (sua parte está ok, só pra garantir)
const dicasSkincare = [
  "Cuidar da pele é um ato de amor próprio 💆‍♀️",
  "Não esqueça do protetor solar, mesmo em dias nublados ☁️☀️",
  "Hidrate a pele diariamente para manter o viço e saúde 💧",
  "Limpe o rosto antes de dormir para evitar cravos e espinhas 🧼",
  "Evite usar produtos com álcool em excesso para não ressecar a pele ❌",
  "Beba bastante água para ajudar a manter a pele hidratada de dentro pra fora 💦",
  "Esfolie a pele uma ou duas vezes por semana para renovar as células 🧽",
  "Durma bem para que a pele se regenere durante a noite 😴",
  "Use produtos adequados para seu tipo de pele para melhores resultados 🧴",
  "Evite tocar no rosto com as mãos sujas para prevenir infecções ✋"
];

function mostrarDica() {
  const indiceAleatorio = Math.floor(Math.random() * dicasSkincare.length);
  const dicaSelecionada = dicasSkincare[indiceAleatorio];
  const elementoDica = document.getElementById('dica-saude');
  if (elementoDica) {
    elementoDica.textContent = dicaSelecionada;
  }
}

window.addEventListener('load', mostrarDica);
