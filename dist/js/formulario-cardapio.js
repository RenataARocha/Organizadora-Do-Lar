document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cardapio');
  const listaCardapio = document.getElementById('lista-cardapio');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const dicaNutritiva = document.getElementById('dica-nutritiva');

  const dicas = [
    "Coma devagar e mastigue bem os alimentos.",
    "Inclua verduras e legumes em pelo menos duas refeições do dia.",
    "Beba bastante água ao longo do dia.",
    "Evite alimentos ultraprocessados sempre que possível.",
    "Coma frutas diariamente, se possível 3 porções!",
    "Prefira preparações assadas, cozidas ou grelhadas.",
    "Inclua fibras como aveia, linhaça e chia na sua rotina.",
    "Inclua vegetais em todas as refeições!",
    "Evite refrigerantes e prefira água ou suco natural.",
    "Faça lanches com frutas e oleaginosas.",
    "Mastigue devagar para melhorar a digestão.",
    "Evite comer tarde da noite.",
    "Aposte em alimentos integrais!",
    "Evite frituras, prefira preparações no forno ou na air fryer.",
    "Inclua vegetais de cores variadas nas refeições.",
    "Beba bastante água ao longo do dia!",
    "Prefira alimentos frescos e naturais em vez dos ultraprocessados.",
    "Comece o dia com um café da manhã equilibrado.",
    "Evite pular refeições — seu corpo precisa de energia constante!",
    "Frutas são ótimas opções de lanche entre as refeições.",
    "Inclua grãos integrais como arroz integral e aveia.",
    "Consuma fontes de proteína magra, como frango e peixe.",
    "Evite excesso de sal e açúcar nos alimentos.",
    "Mastigue devagar e aproveite cada refeição com calma. 🧘‍♀️"
  ];

  function mostrarDica() {
    const random = Math.floor(Math.random() * dicas.length);
    dicaNutritiva.textContent = dicas[random];
  }

  function carregarCardapios() {
    const cardapios = JSON.parse(localStorage.getItem('cardapios')) || [];

    listaCardapio.innerHTML = '';
    if (cardapios.length === 0) {
      mensagemVazia.style.display = 'block';
      return;
    }

    mensagemVazia.style.display = 'none';

    cardapios.forEach((cardapio, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50">
    <div class="flex-1 space-y-1 text-base font-semibold">
      <p>
        <span class="text-pink-500">Dia:</span>
        <span class="text-black">${cardapio.dia}</span>
        ${cardapio.data ? `<span class="text-black"> - (${cardapio.data})</span>` : ''}
      </p>
      <p>
        <span class="text-pink-500">Café:</span>
        <span class="text-black">${cardapio.cafe}</span>
      </p>
      <p>
        <span class="text-pink-500">Almoço:</span>
        <span class="text-black">${cardapio.almoco}</span>
      </p>
      <p>
        <span class="text-pink-500">Lanche:</span>
        <span class="text-black">${cardapio.lanche}</span>
      </p>
      <p>
        <span class="text-pink-500">Jantar:</span>
        <span class="text-black">${cardapio.jantar}</span>
      </p>
      <p>
        <span class="text-pink-500">Recorrência:</span>
        <span class="text-black">${cardapio.recorrencia}</span>
      </p>
      ${cardapio.alarme
          ? `<p><span class="text-pink-500">⏰ Alarme:</span> <span class="text-black">${cardapio.alarme}</span></p>`
          : ''
        }
    </div>

    <button 
      class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1"
      data-index="${index}" 
      title="Remover cardápio"
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

      listaCardapio.appendChild(li);

    });
  }

  function salvarCardapio(dados) {
    const cardapios = JSON.parse(localStorage.getItem('cardapios')) || [];
    cardapios.push(dados);
    localStorage.setItem('cardapios', JSON.stringify(cardapios));
  }

  function ativarAlarme(horario, texto) {
    const [hora, minuto] = horario.split(':').map(Number);
    const agora = new Date();
    const alarme = new Date();

    alarme.setHours(hora, minuto, 0, 0);
    if (alarme < agora) {
      alarme.setDate(alarme.getDate() + 1); // vai pro dia seguinte
    }

    const tempoRestante = alarme.getTime() - agora.getTime();

    setTimeout(() => {
      alert(`🔔 Alarme do Cardápio: ${texto}`);
    }, tempoRestante);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dia = document.getElementById('dia-semana').value;
    const cafe = document.getElementById('cafe').value;
    const almoco = document.getElementById('almoco').value;
    const lanche = document.getElementById('lanche').value;
    const jantar = document.getElementById('jantar').value;

    const data = document.getElementById('task-date').value;
    const recorrencia = document.getElementById('task-recurrence').value;
    const alarme = document.getElementById('task-alarm').value;

    const dados = { dia, cafe, almoco, lanche, jantar, data, recorrencia, alarme };

    salvarCardapio(dados);
    carregarCardapios();

    if (alarme) {
      ativarAlarme(alarme, `Cardápio de ${dia}`);
    }

    form.reset();
  });

  listaCardapio.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.dataset.index;
      const cardapios = JSON.parse(localStorage.getItem('cardapios')) || [];
      cardapios.splice(index, 1);
      localStorage.setItem('cardapios', JSON.stringify(cardapios));
      carregarCardapios();
    }
  });

  mostrarDica();
  carregarCardapios();
});
