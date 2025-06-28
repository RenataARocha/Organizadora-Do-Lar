document.addEventListener('DOMContentLoaded', () => {
  // 🌟 ELEMENTOS DO DOM
  const form = document.getElementById('form-meta');
  const listaMetas = document.getElementById('lista-metas');
  const metaInspiradora = document.getElementById('meta-inspiradora');
  const mensagemVazia = document.getElementById('mensagem-vazia'); // Só coloque se tiver esse elemento no seu HTML

  // 💡 FRASES INSPIRADORAS
  const metasInspiradoras = [
    "Cuidar de mim todos os dias.",
    "Aprender algo novo por semana.",
    "Organizar minha rotina com amor.",
    "Priorizar o que me faz bem.",
    "Dar o meu melhor, com leveza.",
    "Ser gentil comigo mesma em todos os processos.",
    "Realizar sonhos pequenos com o coração grande.",
    "Transformar metas em hábitos de amor próprio.",
    "Lembrar que cada passo conta, mesmo os pequenininhos.",
    "Me tornar a mulher que eu quero ser, todos os dias.",
    "Colocar energia onde há propósito.",
    "Celebrar cada conquista, até as que ninguém vê.",
    "Respeitar meu tempo e meu ritmo.",
    "Persistir mesmo quando der vontade de desistir.",
    "Acreditar no que parece impossível hoje.",
    "Focar no progresso, não na perfeição.",
    "Ter orgulho da mulher que estou me tornando.",
    "Cuidar da minha saúde física e mental com carinho.",
    "Transformar desafios em combustível para crescer.",
    "Me presentear com momentos de paz e silêncio.",
    "Dizer mais 'sim' para o que me faz feliz.",
    "Aceitar que recomeçar também é coragem.",
    "Dar pausas, respirar fundo e continuar firme.",
    "Me cercar de coisas, pessoas e metas que me elevam.",
    "Lembrar que metas não precisam ser grandes pra serem lindas."
  ];

  // 🎯 CARREGAR FRASE ALEATÓRIA E METAS AO INICIAR
  function carregarMetas() {
    listaMetas.innerHTML = '';
    const metas = pegarMetasStorage();

    if (metas.length === 0) {
      if (mensagemVazia) mensagemVazia.style.display = 'block'; // Mostra frase "Nenhuma meta"
    } else {
      if (mensagemVazia) mensagemVazia.style.display = 'none'; // Esconde a frase
    }

    // Se tem metas, mostra frase inspiradora aleatória
    metaInspiradora.textContent = metasInspiradoras[Math.floor(Math.random() * metasInspiradoras.length)];

    metas.forEach((meta, index) => {
      const item = document.createElement('li');
      item.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      item.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
          <div class="flex-1 space-y-1 text-base font-semibold">
            <p><strong class="text-pink-500">${meta.titulo}</strong></p>
            <p class="text-black">${meta.descricao}</p>
            <p><span class="text-pink-500">Categoria:</span> <span class="text-black">${meta.categoria}</span></p>
            <p><span class="text-pink-500">Prazo:</span> <span class="text-black">${meta.prazo || 'Não definido'}</span></p>
            <p><span class="text-pink-500">Prioridade:</span> <span class="text-black">${meta.prioridade}</span></p>
            <p><span class="text-pink-500">🔔 Lembrete:</span> <span class="text-black">${meta.lembrete}</span></p>
          </div>
          <button 
            class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden"
            data-index="${index}" 
            title="Remover meta"
            type="button"
          >
            Remover
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
              style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;</span>
          </button>
        </div>
      `;

      const botaoRemover = item.querySelector('button');
      botaoRemover.addEventListener('click', () => {
        removerMeta(index);
      });

      listaMetas.appendChild(item);
    });
  }

  // 📦 FUNÇÕES AUXILIARES DE LOCALSTORAGE
  function pegarMetasStorage() {
    return JSON.parse(localStorage.getItem('metas')) || [];
  }

  function salvarMetasStorage(metas) {
    localStorage.setItem('metas', JSON.stringify(metas));
  }

  // ⏰ MONTA TEXTO DO LEMBRETE
  function gerarTextoLembrete() {
    const data = document.getElementById('meta-reminder-date').value;
    const hora = document.getElementById('meta-reminder-time').value;
    return data && hora ? `${data} às ${hora}` : 'Sem lembrete';
  }

  // ✨ ADICIONAR NOVA META
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaMeta = {
      id: Date.now(),
      titulo: document.getElementById('meta-title').value,
      descricao: document.getElementById('meta-description').value,
      categoria: document.getElementById('meta-category').value,
      prazo: document.getElementById('meta-deadline').value,
      prioridade: document.getElementById('meta-priority').value,
      lembrete: gerarTextoLembrete()
    };

    const metas = pegarMetasStorage();
    metas.push(novaMeta);
    salvarMetasStorage(metas);

    form.reset();
    carregarMetas();
  });

  // ❌ REMOVER META
  function removerMeta(index) {
    const metas = pegarMetasStorage();
    metas.splice(index, 1);
    salvarMetasStorage(metas);
    carregarMetas();
  }

  // INICIALIZA NA CARGA DA PÁGINA
  carregarMetas();
});
