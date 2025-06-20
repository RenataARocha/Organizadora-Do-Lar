setInterval(() => {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  const agora = new Date();
  const hoje = agora.toISOString().split('T')[0];
  const horaMinuto = agora.toTimeString().slice(0, 5);

  let alarmesDisparados = JSON.parse(localStorage.getItem("alarmesDisparados")) || [];

  tarefas.forEach((tarefa) => {
    const idAlarme = tarefa.title + tarefa.date + tarefa.alarm;

    if (
      tarefa.date === hoje &&
      tarefa.alarm === horaMinuto &&
      !alarmesDisparados.includes(idAlarme)
    ) {
      alert(`⏰ Alarme: ${tarefa.title}`);
      alarmesDisparados.push(idAlarme);
      localStorage.setItem("alarmesDisparados", JSON.stringify(alarmesDisparados));

      // new Audio("assets/alarme.mp3").play(); // ativa som, se quiser depois
    }
  });
}, 60000);
