import { voltarParaHome } from './funcoes-globais.js';
import { initLembretes } from './lembrete.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';


document.addEventListener('DOMContentLoaded', () => {
  // 🌟 ELEMENTOS DO DOM
  initLembretes('metas', 'lista-metas', 'mensagemVazia');

  const form = document.getElementById('form-meta');
  const listaMetas = document.getElementById('lista-metas');
  const metaInspiradora = document.getElementById('meta-inspiradora');
  const mensagemVazia = document.getElementById('mensagemVazia'); // Opcional, se existir no HTML

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

    metaInspiradora.textContent = metasInspiradoras[Math.floor(Math.random() * metasInspiradoras.length)];

    metas.forEach((meta, index) => {
      const item = document.createElement('li');
      item.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';


      item.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
  <div class="flex-1 space-y-2 text-base font-semibold text-black">
    ${formatarExibicao(meta, 'meta')}
  </div>
  <div class="flex flex-col items-end gap-1">
    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover meta"
      type="button"
    >
      Remover
      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
        style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">
        &#xf004;
      </span>
    </button>
    <button 
  class="relative bg-pink-400 text-white h-fit py-2 pr-12 pl-7 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 font-semibold overflow-hidden btn-editar"
      data-index="${index}" 
      title="Editar meta"
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

      const botaoRemover = item.querySelector('button.btn-remover');
      botaoRemover.addEventListener('click', () => removerMeta(index));

      const botaoEditar = item.querySelector('button.btn-editar');
      botaoEditar.addEventListener('click', () => editarMeta(index));


      listaMetas.appendChild(item);

    });
  }

  function editarMeta(index) {
    const metas = pegarMetasStorage();
    const meta = metas[index];

    document.getElementById('meta-title').value = meta.titulo || '';
    document.getElementById('meta-description').value = meta.descricao || '';
    document.getElementById('meta-category').value = meta.categoria || '';
    document.getElementById('meta-deadline').value = meta.prazo || '';
    document.getElementById('meta-priority').value = meta.prioridade || '';

    if (meta.lembrete) {
      const [data, hora] = meta.lembrete.split(' às ');
      document.getElementById('meta-reminder-date').value = data || '';
      document.getElementById('meta-reminder-time').value = hora || '';
    }

    // Remove a meta antiga para salvar a editada
    metas.splice(index, 1);
    salvarMetasStorage(metas);
  }


  // 📦 LOCALSTORAGE
  function pegarMetasStorage() {
    return JSON.parse(localStorage.getItem('metas')) || [];
  }
  function salvarMetasStorage(metas) {
    localStorage.setItem('metas', JSON.stringify(metas));
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('meta-title').value.trim();
    const descricao = document.getElementById('meta-description').value.trim();
    const categoria = document.getElementById('meta-category').value;
    const date = document.getElementById('meta-deadline').value;
    const prioridade = document.getElementById('meta-priority').value;
    const reminderDate = document.getElementById('meta-reminder-date').value;
    const reminderTime = document.getElementById('meta-reminder-time').value;
    const lembrete = reminderDate && reminderTime ? `${reminderDate} às ${reminderTime}` : '';

    if (!titulo) {
      alert('Por favor, preencha o título da meta.');
      return;
    }
    if (!date) {
      alert('Por favor, selecione o prazo da meta.');
      return;
    }

    const hora = document.getElementById('meta-reminder-time').value; // pega o valor do input hora
    const icone = obterIconeCategoria(categoria);

    const novaMeta = {
      id: Date.now(),
      tipo: 'meta',
      icone,
      titulo,
      descricao,
      data: date || null,
      prazo: date || null,
      hora,
      categoria,
      prioridade,
      lembrete,
    };

    const metas = pegarMetasStorage();
    metas.push(novaMeta);
    salvarMetasStorage(metas);

    form.reset();
    carregarMetas();
  });

  function removerMeta(index) {
    const metas = pegarMetasStorage();
    metas.splice(index, 1);
    salvarMetasStorage(metas);
    carregarMetas();
  }

  carregarMetas();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
