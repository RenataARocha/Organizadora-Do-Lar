document.addEventListener("DOMContentLoaded", () => {
  // Container das florzinhas
  const fundoFlor = document.createElement('div');
  fundoFlor.id = "fundo-florzinhas";
  fundoFlor.className = "fixed top-0 left-0 w-full h-full -z-20 pointer-events-none";
  document.body.appendChild(fundoFlor);

  // Container dos dots
  const fundoDots = document.createElement('div');
  fundoDots.id = "fundo-dots";
  fundoDots.className = "fixed top-0 left-0 w-full h-full -z-30 pointer-events-none";
  document.body.appendChild(fundoDots);

  // 🌸 Florzinhas fixas
  const florzinhasFixas = [
    { top: '5%', left: '2%', rotate: 15 },
    { top: '2%', right: '24%', rotate: -20 },
    { bottom: '15%', left: '15%', rotate: 5 },
    { bottom: '8%', right: '8%', rotate: -10 },
    { top: '45%', left: '40%', rotate: 25 }
  ];

  florzinhasFixas.forEach(pos => {
    const flor = document.createElement('div');
    flor.className = "absolute bg-no-repeat bg-contain";
    flor.style.backgroundImage = "url('../assets/florzinha.png')"; // Ajuste se o caminho mudar
    flor.style.width = "250px";
    flor.style.height = "250px";
    flor.style.opacity = "0.10";
    flor.style.transform = `rotate(${pos.rotate}deg)`;

    for (let prop in pos) {
      if (prop !== 'rotate') {
        flor.style[prop] = pos[prop];
      }
    }

    fundoFlor.appendChild(flor);
  });

  // 🟤 Bolinhas aleatórias
  const numDots = 270;

  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.className = "absolute rounded-full";
    
    const size = Math.random() * 2 + 2; // Tamanho entre 2 e 4px
    const opacity = Math.random() * 0.3 + 0.2; // Opacidade entre 0.2 e 0.5

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.backgroundColor = "#FF69B4";
    dot.style.opacity = opacity;
    
    fundoDots.appendChild(dot);
  }
});
