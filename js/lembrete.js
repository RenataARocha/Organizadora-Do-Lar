// lembrete.js - Modelo base para seus lembretes
// Passe a chave do localStorage quando usar a função initLembretes

export function initLembretes(chaveStorage, idLista, idMensagemVazia) {
  const listaElement = document.getElementById(idLista);
  const mensagemVazia = document.getElementById(idMensagemVazia);

  // Carrega lembretes do localStorage
  function carregarLembretes() {
    const json = localStorage.getItem(chaveStorage);
    return json ? JSON.parse(json) : [];
  }

  // Salva lembretes no localStorage
  function salvarLembretes(lembretes) {
    localStorage.setItem(chaveStorage, JSON.stringify(lembretes));
  }

  // Renderiza a lista de lembretes
  function renderizarLembretes() {
    const lembretes = carregarLembretes();
    listaElement.innerHTML = '';

    if (lembretes.length === 0) {
      if (mensagemVazia) mensagemVazia.style.display = 'block';
      return;
    }

    if (mensagemVazia) mensagemVazia.style.display = 'none';

    lembretes.forEach((lembrete, index) => {
      const li = document.createElement('li');
      li.className = 'mb-3 p-3 rounded shadow bg-purple-50 hover:bg-rose-50 cursor-pointer';

      // Aqui você pode customizar a exibição do lembrete conforme estrutura
      li.innerHTML = `
        <div class="flex justify-between items-center">
          <div>
            <p><strong>${lembrete.title || 'Lembrete'}</strong></p>
            <p>Data: ${lembrete.lembreteData || '-'} ${lembrete.lembreteHora || ''}</p>
            <p>Descrição: ${lembrete.descricao || '-'}</p>
          </div>
          <button class="btn-remover bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500" data-index="${index}" title="Remover lembrete">Remover</button>
        </div>
      `;

      listaElement.appendChild(li);
    });

    adicionarEventoRemocao();
    checarAlertas();
  }

  // Adiciona evento para remover lembrete
  function adicionarEventoRemocao() {
    const botoes = listaElement.querySelectorAll('.btn-remover');
    botoes.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-index'));
        removerLembrete(idx);
      });
    });
  }

  // Remove lembrete e atualiza lista e storage
  function removerLembrete(index) {
    const lembretes = carregarLembretes();
    lembretes.splice(index, 1);
    salvarLembretes(lembretes);
    renderizarLembretes();
  }

  // Verifica lembretes próximos e mostra alertas
  function checarAlertas() {
    const lembretes = carregarLembretes();
    const agora = new Date();

    lembretes.forEach(lembrete => {
      if (!lembrete.lembreteData || !lembrete.lembreteHora) return;

      const dataHoraLembrete = new Date(`${lembrete.lembreteData}T${lembrete.lembreteHora}:00`);

      // Se o lembrete for hoje e faltarem menos de 10 minutos
      const diffMs = dataHoraLembrete - agora;
      if (diffMs > 0 && diffMs <= 10 * 60 * 1000) {
        alert(`⏰ Lembrete próximo: ${lembrete.title || 'Sem título'} às ${lembrete.lembreteHora}`);
      }
    });
  }

  // Inicializa o módulo
  function init() {
    renderizarLembretes();
    // Checa lembretes a cada minuto
    setInterval(checarAlertas, 60 * 1000);
  }

  init();
}
