// lembrete.js - Gerenciador universal de lembretes com notificação ✨

// ✅ Solicita permissão para notificações do navegador (uma vez só)
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then((permission) => {
    console.log('Permissão de notificação:', permission);
  });
}

// ✅ Função para mostrar notificação personalizada (com som e ícone)
function mostrarNotificacao(titulo, mensagem, icone = './assets/lembrete-icon.png') {
  if (Notification.permission === 'granted') {
    new Notification(titulo, {
      body: mensagem,
      icon: icone
    });

    // 🔊 Reproduz um som fofo (adicione esse arquivo em assets!)
    const audio = new Audio('./assets/alarme-fofinho.mp3');
    audio.play().catch(() => { }); // ignora erros se som for bloqueado
  }
}

// ✅ Função principal — inicializa lembretes por aba
export function initLembretes(chaveStorage, idLista, idMensagemVazia) {
  const listaElement = document.getElementById(idLista);
  const mensagemVazia = document.getElementById(idMensagemVazia);

  function carregarLembretes() {
    const json = localStorage.getItem(chaveStorage);
    return json ? JSON.parse(json) : [];
  }

  function salvarLembretes(lembretes) {
    localStorage.setItem(chaveStorage, JSON.stringify(lembretes));
  }

  function removerLembrete(index) {
    const lembretes = carregarLembretes();
    lembretes.splice(index, 1);
    salvarLembretes(lembretes);
    renderizarLembretes();
  }

  function adicionarEventoRemocao() {
    const botoes = listaElement.querySelectorAll('.btn-remover');
    botoes.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-index'));
        removerLembrete(idx);
      });
    });
  }

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

  function checarAlertas() {
    const lembretes = carregarLembretes();
    const agora = new Date();

    lembretes.forEach(lembrete => {
      if (!lembrete.lembreteData || !lembrete.lembreteHora) return;

      const dataHoraLembrete = new Date(`${lembrete.lembreteData}T${lembrete.lembreteHora}:00`);
      const diffMs = dataHoraLembrete - agora;

      if (diffMs > 0 && diffMs <= 10 * 60 * 1000) {
        const titulo = `⏰ Lembrete: ${lembrete.title || 'Sem título'}`;
        const corpo = `⏳ Está marcado para às ${lembrete.lembreteHora}`;

        // 🔔 Notificação real + alert tradicional
        mostrarNotificacao(titulo, corpo, './assets/lembrete-icon.png');
        alert(`${titulo} às ${lembrete.lembreteHora}`);
      }
    });
  }

  function init() {
    renderizarLembretes();
    setInterval(checarAlertas, 60 * 1000); // checa a cada minuto
  }

  init();
}