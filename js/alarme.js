document.addEventListener('deviceready', () => {
  console.log("📱 Dispositivo pronto. Agendando alarmes...");

  // Recupera os dados de cada categoria do localStorage
  const tarefas    = JSON.parse(localStorage.getItem("tarefas")) || [];
  const remedios   = JSON.parse(localStorage.getItem("remedios")) || [];
  const skincare   = JSON.parse(localStorage.getItem("skincare")) || [];
  const cronograma = JSON.parse(localStorage.getItem("cronogramaCapilarEtapas")) || [];

  // Função genérica para agendar alarmes por categoria
  function agendarAlarmesPorCategoria(categoria, listaDeItens) {
    listaDeItens.forEach((item, index) => {
      if (!item.date || !item.alarme) return; // Se não tiver data ou alarme, ignora

      const dataAlarme = new Date(`${item.date}T${item.alarme}:00`);

      // Só agenda se o horário ainda estiver no futuro
      if (dataAlarme > new Date()) {
        cordova.plugins.notification.local.schedule({
          id: parseInt(`${categoria.length}${index}`), // Garante ID único
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

  // Agenda alarmes
  agendarAlarmesPorCategoria("tarefas", tarefas);
  agendarAlarmesPorCategoria("remédios", remedios);
  agendarAlarmesPorCategoria("skincare", skincare);
  agendarAlarmesPorCategoria("cronograma capilar", cronograma); // ✅ Adicionado
});
