import { voltarParaHome } from './funcoes-globais.js';
import { obterIconeCategoria } from './utils.js';
import { formatarExibicao } from './exibicao-completa.js';

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

  // Função para adicionar tempo conforme recorrência
  function adicionarTempo(dataStr, recorrencia) {
    const data = new Date(dataStr);
    switch (recorrencia.toLowerCase()) {
      case 'diária': data.setDate(data.getDate() + 1); break;
      case 'semanal': data.setDate(data.getDate() + 7); break;
      case 'quinzenal': data.setDate(data.getDate() + 15); break;
      case 'mensal': data.setMonth(data.getMonth() + 1); break;
      case 'anual': data.setFullYear(data.getFullYear() + 1); break;
      default: break;
    }
    return data.toISOString().slice(0, 10);
  }

  // Atualiza datas dos cardápios com recorrência
  function atualizarRecorrencias() {
    const cardapios = JSON.parse(localStorage.getItem('cardapios')) || [];
    const hoje = new Date().toISOString().slice(0, 10);
    let alterou = false;

    cardapios.forEach(cardapio => {
      if (cardapio.recorrencia && cardapio.recorrencia.toLowerCase() !== 'nenhuma') {
        // Para recorrência semanal, checar dias da semana
        if (cardapio.recorrencia.toLowerCase() === 'semanal') {
          // Se a data já passou, avançar para o próximo dia da semana selecionado
          while (cardapio.data <= hoje) {
            cardapio.data = adicionarTempo(cardapio.data, 'diária');
            // Se o novo dia estiver entre os diasSemana selecionados, sai do loop
            const diaSemanaAtual = new Date(cardapio.data).toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
            if (cardapio.diasSemana?.map(d => d.toLowerCase()).includes(diaSemanaAtual)) {
              break;
            }
          }
        } else {
          // Para outras recorrências simples, só avança a data enquanto ela for menor ou igual a hoje
          while (cardapio.data <= hoje) {
            cardapio.data = adicionarTempo(cardapio.data, cardapio.recorrencia);
          }
        }
        alterou = true;
      }
    });

    if (alterou) {
      localStorage.setItem('cardapios', JSON.stringify(cardapios));
    }
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

      const icone = obterIconeCategoria('cardapio');

      li.innerHTML = `
  <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
    <div class="flex-1 space-y-2 text-base font-semibold text-black">
      ${formatarExibicao(
        { ...cardapio, titulo: `${icone} Cardápio` },
        'cardapio'
      )}
      <p class="text-sm text-gray-600">Data: ${cardapio.data}</p>
      ${cardapio.recorrencia && cardapio.recorrencia.toLowerCase() !== 'nenhuma' ? `<p class="text-sm text-pink-500 font-semibold">Recorrência: ${cardapio.recorrencia}</p>` : ''}
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // pegar os dias da semana selecionados (checkboxes)
    const diasSelecionados = Array.from(document.querySelectorAll('input[name="dias-semana"]:checked'))
      .map(checkbox => checkbox.value);

    const data = document.getElementById('task-date').value;
    const cafe = document.getElementById('cafe').value.trim();
    const almoco = document.getElementById('almoco').value.trim();
    const lanche = document.getElementById('lanche').value.trim();
    const jantar = document.getElementById('jantar').value.trim();
    const recorrencia = document.getElementById('task-recurrence').value;

    if (!cafe && !almoco && !lanche && !jantar) {
      alert('Por favor, preencha pelo menos uma refeição.');
      return;
    }

    if (recorrencia.toLowerCase() === 'semanal' && diasSelecionados.length === 0) {
      alert('Selecione pelo menos um dia da semana para recorrência semanal.');
      return;
    }

    const dados = {
      data,
      diasSemana: diasSelecionados,
      cafe,
      almoco,
      lanche,
      jantar,
      recorrencia,
      title: `🍽️ Cardápio`,
      titulo: `Cardápio` // 👈 ISSO AQUI É A CHAVE!
    };


    salvarCardapio(dados);
    atualizarRecorrencias(); // atualiza datas já existentes no armazenamento
    carregarCardapios();

    form.reset();
  });

  listaCardapio.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remover')) {
      const index = e.target.closest('.btn-remover').dataset.index;
      const cardapios = JSON.parse(localStorage.getItem('cardapios')) || [];
      cardapios.splice(index, 1);
      localStorage.setItem('cardapios', JSON.stringify(cardapios));
      carregarCardapios();
    }
  });

  mostrarDica();
  atualizarRecorrencias();
  carregarCardapios();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
