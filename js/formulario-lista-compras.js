import { voltarParaHome } from './funcoes-globais.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-compras');
  const listaCompras = document.getElementById('lista-compras');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const dicaCompras = document.getElementById('dica-compras');

  let compras = JSON.parse(localStorage.getItem('compras')) || [];

  function atualizarLista() {
    listaCompras.innerHTML = '';

    if (compras.length === 0) {
      mensagemVazia.style.display = 'block';
    } else {
      mensagemVazia.style.display = 'none';

      compras.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'mb-3 p-3 rounded-lg shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';
        li.dataset.index = index;

        li.innerHTML = `
        <div class="flex justify-between items-start gap-4 p-4 rounded-lg shadow bg-pink-50 hover:bg-rose-100 transition-all">
          <div class="flex-1 space-y-2 text-base font-semibold text-black">
            <p>
              <span class="text-pink-500">📦 Nome:</span> ${item.nome}
            </p>
            <p>
              <span class="text-pink-500">📂 Categoria:</span> ${item.categoria}
            </p>
            <p>
              <span class="text-pink-500">🔢 Quantidade:</span> ${item.quantidade}
            </p>
            <p>
              <span class="text-pink-500">⚡ Prioridade:</span> ${item.prioridade}
            </p>
            <p>
              <span class="text-pink-500">📅 Data:</span> ${item.date || 'Não definida'}
            </p>
          </div>

          <button 
            class="relative bg-pink-400 text-white h-fit py-2 pr-10 pl-4 rounded-lg hover:bg-pink-500 transition-all duration-300 ease-in-out active:translate-y-1 btn-remover font-semibold overflow-hidden mt-1" 
            data-index="${index}" 
            title="Remover item"
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

        listaCompras.appendChild(li);
      });
    }

    mostrarDica();
  }

  function removerItem(index) {
    compras.splice(index, 1);
    localStorage.setItem('compras', JSON.stringify(compras));
    atualizarLista();
  }

  listaCompras.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remover')) {
      const li = e.target.closest('li');
      const index = Number(li.dataset.index);
      removerItem(index);
    }
  });

  function mostrarDica() {
    const dicas = [
      "Prefira comprar produtos da estação para economizar.",
      "Verifique a validade dos produtos antes de comprar.",
      "Compre em quantidades maiores para itens não perecíveis.",
      "Faça uma lista antes de sair para evitar compras por impulso.",
      "Aproveite promoções, mas só compre o que realmente precisa.",
      "Pesquise preços em diferentes lojas antes de decidir.",
      "Prefira marcas confiáveis, mesmo que custem um pouco mais.",
      "Evite fazer compras com fome para não exagerar.",
      "Leve sacolas reutilizáveis para ajudar o meio ambiente.",
      "Confira se o produto tem garantia e política de troca clara.",
      "Prefira produtos com menos embalagens para reduzir lixo.",
      "Use cupons de desconto e cashback sempre que possível."
    ];
    const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
    dicaCompras.textContent = dicaAleatoria;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('item-nome').value.trim();
    const categoria = document.getElementById('item-categoria').value;
    const quantidade = Number(document.getElementById('item-qtd').value) || 1;
    const prioridade = document.getElementById('item-prioridade').value;
    const date = document.getElementById('item-data').value; // data no formato YYYY-MM-DD

    if (!nome) {
      alert('Por favor, preencha o nome do item.');
      return;
    }
    if (!date) {
      alert('Por favor, selecione a data da compra.');
      return;
    }

    // Cria o objeto com o campo date e title para compatibilidade com o calendário
    const novoItem = { 
      nome, 
      categoria, 
      quantidade, 
      prioridade, 
      date,
      title: `Compra: ${nome}`
    };

    compras.push(novoItem);
    localStorage.setItem('compras', JSON.stringify(compras));

    form.reset();
    atualizarLista();
  });

  atualizarLista();

  const botaoVoltar = document.getElementById('btn-voltar');
  if (botaoVoltar) {
    botaoVoltar.addEventListener('click', voltarParaHome);
  }
});
