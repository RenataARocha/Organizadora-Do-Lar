const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();

function ativarAudioContext() {
  if (contextoAudio.state === 'suspended') {
    contextoAudio.resume();
  }
  document.removeEventListener('click', ativarAudioContext);
}

document.addEventListener('click', ativarAudioContext);

function tocarAlarme() {
  const oscillator = contextoAudio.createOscillator();
  oscillator.type = 'sine'; 
  oscillator.frequency.setValueAtTime(440, contextoAudio.currentTime);
  oscillator.connect(contextoAudio.destination);
  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, 1000);
}

setInterval(() => {
  console.log("🔁 Verificando alarmes...");

  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  const agora = new Date();
  const hoje = agora.toLocaleDateString('sv-SE'); 
  const horaMinuto = agora.toTimeString().slice(0, 5); 

  let alarmesDisparados = JSON.parse(localStorage.getItem("alarmesDisparados")) || [];

  tarefas.forEach((tarefa) => {
    const idAlarme = `${tarefa.title}-${tarefa.date}-${tarefa.alarm}`;

    console.log(`🔍 Comparando: ${tarefa.title}`);
    console.log(`📆 Data tarefa: ${tarefa.date} | Hoje: ${hoje}`);
    console.log(`⏰ Hora tarefa: ${tarefa.alarm} | Agora: ${horaMinuto}`);

    if (
      tarefa.date === hoje &&
      tarefa.alarm === horaMinuto &&
      !alarmesDisparados.includes(idAlarme)
    ) {
      alert(`⏰ Alarme disparado: ${tarefa.title}`);
      tocarAlarme();
      alarmesDisparados.push(idAlarme);
      localStorage.setItem("alarmesDisparados", JSON.stringify(alarmesDisparados));
    }
  });
}, 60000);
