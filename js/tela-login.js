document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const btnCriarConta = document.getElementById("btn-criar-conta");
  const btnInstalar = document.getElementById("btn-instalar");

  // 🔐 Verifica se já tem um usuário logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    // Redireciona automaticamente se já estiver logado
    window.location.href = "pages/tela-inicial.html";
    return; // impede que o resto do código execute
  }

  // Criar Conta
  btnCriarConta.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos para criar conta!");
      return;
    }

    if (localStorage.getItem(email)) {
      alert("Esse e-mail já está cadastrado!");
      return;
    }

    localStorage.setItem(email, senha);
    alert("Conta criada com sucesso! Agora faça login.");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  });

  // Entrar/Login
  btnEntrar.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    const senhaArmazenada = localStorage.getItem(email);

    if (!senhaArmazenada) {
      alert("Usuário não encontrado! Crie uma conta primeiro.");
      return;
    }

    if (senha === senhaArmazenada) {
      alert("Login bem-sucedido! 🚀");

      // 💾 Salva que o usuário está logado
      localStorage.setItem("usuarioLogado", email);

      // Redireciona
      setTimeout(() => {
        window.location.href = "pages/tela-inicial.html";
      }, 500);
    } else {
      alert("Senha incorreta!");
    }
  });

  // Service Worker para PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("../pwa/service-worker.js")
        .then((reg) => console.log("Service Worker registrado com sucesso 🎉:", reg))
        .catch((err) => console.warn("Erro ao registrar o Service Worker 😢:", err));
    });
  }

  // Lógica para botão "Instalar App" PWA
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // bloqueia o prompt automático
    deferredPrompt = e;

    if (btnInstalar) {
      btnInstalar.style.display = "block";

      btnInstalar.addEventListener(
        "click",
        () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("Usuário aceitou a instalação!");
            } else {
              console.log("Usuário rejeitou a instalação!");
            }
            deferredPrompt = null;
            btnInstalar.style.display = "none";
          });
        },
        { once: true }
      );
    }
  });

  // Esconder botão se app já instalado
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  ) {
    if (btnInstalar) btnInstalar.style.display = "none";
  }
});
