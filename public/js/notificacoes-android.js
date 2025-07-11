import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function agendarNotificacaoAndroid(tarefa) {
  if (Capacitor.getPlatform() !== 'android') return;

  const dataHora = new Date(`${tarefa.date}T${tarefa.alarm}`);
  const timestamp = dataHora.getTime();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: Math.floor(Math.random() * 100000),
        title: "⏰ Alarme da Tarefa",
        body: `Tarefa: ${tarefa.title}`,
        schedule: { at: new Date(timestamp) },
        sound: "beep.mp3", // Coloque beep.mp3 na pasta android/res/raw
      },
    ],
  });
}
