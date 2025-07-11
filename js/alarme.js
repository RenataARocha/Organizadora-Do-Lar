document.addEventListener('deviceready', () => {
  console.log("📱 Dispositivo pronto. Agendando alarmes...");

  // Recupera os dados de cada categoria do localStorage
  const tarefas   = JSON.parse(localStorage.getItem("tarefas"))   || [];
  const cardapio  = JSON.parse(localStorage.getItem("cardapios"))  || [];
  const remedios  = JSON.parse(localStorage.getItem("remedios"))  || [];
  const skincare  = JSON.parse(localStorage.getItem("skincare"))  || [];

  // Função genérica para agendar alarmes por categoria
  function agendarAlarmesPorCategoria(categoria, listaDeItens) {
    listaDeItens.forEach((item, index) => {
      if (!item.date || !item.alarm) return; // Se não tiver data ou alarme, ignora

      const dataAlarme = new Date(`${item.date}T${item.alarm}:00`);

      // Só agenda se o horário ainda estiver no futuro
      if (dataAlarme > new Date()) {
        cordova.plugins.notification.local.schedule({
          id: parseInt(`${categoria.length}${index}`), // Garante ID único por categoria
          title: `⏰ Alerta de ${categoria}`,
          text: item.title,
          trigger: { at: dataAlarme },
          sound: 'file://assets/sounds/beep.mp3',
          foreground: true,
        });

        console.log(`🔔 ${categoria.toUpperCase()} - "${item.title}" agendado para ${dataAlarme}`);
      }
    });
  }

  // Agenda para todas as categorias
  agendarAlarmesPorCategoria("tarefas", tarefas);
  agendarAlarmesPorCategoria("cardápio", cardapio);
  agendarAlarmesPorCategoria("remédios", remedios);
  agendarAlarmesPorCategoria("skincare", skincare);
});
