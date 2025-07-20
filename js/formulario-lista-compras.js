import { voltarParaHome } from './funcoes-globais.js';
import { formatarExibicao } from './exibicao-completa.js';
import { obterIconeCategoria, normalizarCategoria } from './utils.js';

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

      // Agrupar itens por categoria
      const categoriasAgrupadas = {};

      compras.forEach((item, index) => {
        if (!categoriasAgrupadas[item.categoria]) {
          categoriasAgrupadas[item.categoria] = [];
        }
        categoriasAgrupadas[item.categoria].push({ ...item, index });
      });

      // Renderizar cada categoria com seus itens
      Object.entries(categoriasAgrupadas).forEach(([categoria, itens]) => {
        const icone = obterIconeCategoria(categoria);

        const blocoCategoria = document.createElement('li');
        blocoCategoria.className = 'mb-4 p-4 rounded-lg bg-white shadow';

        // Título da categoria
        const titulo = document.createElement('p');
        titulo.className = 'font-bold text-pink-500 text-lg mb-2';
        titulo.textContent = `📂 Categoria: ${icone} ${categoria}`;
        blocoCategoria.appendChild(titulo);

        // Lista dos itens da categoria
        itens.forEach((item) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'flex justify-between items-center text-sm bg-pink-50 hover:bg-rose-100 px-4 py-2 rounded mb-2';

          itemDiv.innerHTML = `
            <span class="font-medium text-gray-700">🛒 ${item.nome} ${item.quantidade}</span>
            <button
              class="relative bg-pink-400 text-white py-1 px-4 rounded-lg hover:bg-pink-500 transition active:translate-y-1 btn-remover font-semibold"
              data-index="${item.index}"
              title="Remover item"
              type="button"
            >
              Remover
              <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 pointer-events-none"
                style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf004;</span>
            </button>
          `;
          blocoCategoria.appendChild(itemDiv);
        });

        listaCompras.appendChild(blocoCategoria);
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
    const botao = e.target.closest('.btn-remover');
    if (!botao) return;
    const index = Number(botao.dataset.index);
    removerItem(index);
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
    dicaCompras.textContent = dicas[Math.floor(Math.random() * dicas.length)];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('item-nome').value.trim();
    const categoriaOriginal = document.getElementById('item-categoria').value;
    const categoria = normalizarCategoria(categoriaOriginal);
    const quantidade = Number(document.getElementById('item-qtd').value) || 1;
    const prioridade = document.getElementById('item-prioridade').value;

    if (!nome) {
      alert('Por favor, preencha o nome do item.');
      return;
    }

    const itemExistenteIndex = compras.findIndex(item =>
      item.nome.toLowerCase() === nome.toLowerCase() &&
      item.categoria === categoria
    );

    if (itemExistenteIndex !== -1) {
      compras[itemExistenteIndex].quantidade += quantidade;
    } else {
      compras.push({
        nome,
        categoria,
        quantidade,
        prioridade,
        titulo: nome
      });
    }

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
