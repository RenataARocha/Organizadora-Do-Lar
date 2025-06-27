document.addEventListener("DOMContentLoaded", () => {
  // 🔗 Elementos da página
  const btnEntrar = document.getElementById("btn-entrar");
  const btnCriarConta = document.getElementById("btn-criar-conta");
  const btnInstalar = document.getElementById("btn-instalar");
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const iconEye = document.getElementById('icon-eye');

  // 🔐 Verifica se já tem usuário logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    window.location.href = "pages/tela-inicial.html";
    return;
  }

  // 👁️ Alternar visibilidade da senha
  if (togglePassword && passwordInput && iconEye) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      iconEye.classList.toggle("fa-eye");
      iconEye.classList.toggle("fa-eye-slash");
    });
  }

  // ➕ Criar conta
  btnCriarConta?.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const senha = passwordInput.value.trim();

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
    passwordInput.value = "";
  });

  // 🔐 Login
  btnEntrar?.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const senha = passwordInput.value.trim();

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
      localStorage.setItem("usuarioLogado", email);

      setTimeout(() => {
        window.location.href = "pages/tela-inicial.html";
      }, 500);
    } else {
      alert("Senha incorreta!");
    }
  });

  // 📲 Service Worker para PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("../pwa/service-worker.js")
        .then((reg) => console.log("Service Worker registrado com sucesso 🎉:", reg))
        .catch((err) => console.warn("Erro ao registrar o Service Worker 😢:", err));
    });
  }

  // 📥 Instalação do App (PWA)
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (btnInstalar) {
      btnInstalar.style.display = "block";
      btnInstalar.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Usuário aceitou a instalação!");
          } else {
            console.log("Usuário rejeitou a instalação.");
          }
          deferredPrompt = null;
          btnInstalar.style.display = "none";
        });
      }, { once: true });
    }
  });

  // Esconde botão se app já estiver instalado
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  ) {
    if (btnInstalar) btnInstalar.style.display = "none";
  }
});
