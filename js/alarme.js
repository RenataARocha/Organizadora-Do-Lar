const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();

// Ativa o áudio no primeiro clique (por causa das políticas de autoplay dos browsers)
function ativarAudioContext() {
  if (contextoAudio.state === 'suspended') {
    contextoAudio.resume();
  }
  document.removeEventListener('click', ativarAudioContext);
}
document.addEventListener('click', ativarAudioContext);

// Função para tocar o alarme sonoro
function tocarAlarme() {
  if (contextoAudio.state !== 'running') {
    console.warn("🔇 Áudio context não está ativo.");
    return;
  }

  const oscillator = contextoAudio.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, contextoAudio.currentTime); // Tom mais suave
  oscillator.connect(contextoAudio.destination);
  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, 1500);
}

// Função para verificar e disparar alarmes
function verificarAlarmes() {
  console.log("🔁 Verificando alarmes...");

  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  const agora = new Date();
  const hoje = agora.toLocaleDateString('sv-SE');
  const horaMinuto = agora.toTimeString().slice(0, 5); // HH:MM

  let alarmesDisparados = JSON.parse(localStorage.getItem("alarmesDisparados")) || [];

  tarefas.forEach((tarefa) => {
    const idAlarme = `${tarefa.title}-${tarefa.date}-${tarefa.alarm}`;

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
}

// Executa a verificação a cada minuto
setInterval(verificarAlarmes, 60000);

// Exporta a função se estiver em ambiente de módulo (opcional)
if (typeof module !== 'undefined') {
  module.exports = { verificarAlarmes, tocarAlarme };
}
