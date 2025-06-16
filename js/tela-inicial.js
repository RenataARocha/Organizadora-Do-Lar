document.addEventListener('DOMContentLoaded', function () {
  // 🌼 Frase do dia
  const frases = [
    "Você é mais forte do que imagina 🌸",
    "Cada dia é uma nova chance de recomeçar ☀️",
    "Seja gentil consigo mesma 💕",
    "Organizar o dia é o primeiro passo pra conquistar seus sonhos ✨",
    "Pequenos passos também são progresso 🚶‍♀️",
    "Você dá conta, sim! 🌷",
    "Respira fundo… um passo de cada vez, você vai longe 🌿",
    "Seu esforço de hoje é o brilho de amanhã 💫",
    "Não precisa ser perfeito, só precisa ser feito 🧸",
    "Você está exatamente onde precisa estar para começar 🌈",
    "Até os dias nublados preparam lindos recomeços ☁️✨",
    "Confia no processo, você está crescendo mesmo sem perceber 🌱",
    "Cuide de você como cuida de quem ama 🧡",
    "Hoje é um ótimo dia pra se orgulhar do que você já conquistou 🌷",
    "Você já passou por tanta coisa… e segue firme! Isso é força 🦋",
    "Se cansar, respira. Mas não desiste, tá? 🚶‍♀️💪"
  ];

  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  const elementoFrase = document.getElementById("frase-do-dia");
  if (elementoFrase) {
    elementoFrase.textContent = fraseAleatoria;
  }

  // 🧠 Alternância entre seções (abre/fecha ao clicar)
  const botoes = document.querySelectorAll('.menu-principal .btn');
  const telas = document.querySelectorAll('.tela-oculta');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const telaId = botao.getAttribute('data-tela');
      const tela = document.getElementById(telaId);

      if (tela.classList.contains('hidden')) {
        // Fecha todas e abre a clicada
        telas.forEach(t => t.classList.add('hidden'));
        tela.classList.remove('hidden');
      } else {
        // Fecha a clicada se já estiver aberta
        tela.classList.add('hidden');
      }
    });
  });
});



new Pikaday({
  field: document.getElementById('datepicker'),
  format: 'DD/MM/YYYY',
  i18n: {
    previousMonth: 'Anterior',
    nextMonth: 'Próximo',
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  }
});

