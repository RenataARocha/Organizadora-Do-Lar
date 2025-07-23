console.log("🚀 Script de pendências carregado!");

document.addEventListener("DOMContentLoaded", () => {
  const containerAviso = document.createElement("div");
  containerAviso.id = "aviso-pendencia";
  containerAviso.className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4 hidden";
  containerAviso.innerHTML = `
    <strong class="font-bold">🚨 Pendência Detectada:</strong>
    <span class="block sm:inline">Você ainda tem tarefas ou metas que passaram do prazo. Que tal dar uma olhadinha? 😉</span>
  `;
  document.body.prepend(containerAviso);

  verificarPendencias();

  function verificarPendencias() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const metas = JSON.parse(localStorage.getItem("metas")) || [];

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const pendenteTarefa = tarefas.some(tarefa => {
      const rawPrazo = tarefa.prazo || tarefa.data;
      const prazo = new Date(rawPrazo);
      prazo.setHours(0, 0, 0, 0);
      return tarefa.status?.trim().toLowerCase() !== "concluida" && prazo < hoje;
    });

    const pendenteMeta = metas.some(meta => {
      const rawPrazo = meta.prazo || meta.data;
      const prazo = new Date(rawPrazo);
      prazo.setHours(0, 0, 0, 0);
      return meta.status?.trim().toLowerCase() !== "concluida" && prazo < hoje;
    });

    if (pendenteTarefa || pendenteMeta) {
      console.log("⚠️ Pendência detectada! Exibindo aviso.");
      containerAviso.classList.remove("hidden");
    } else {
      console.log("✅ Sem pendências encontradas.");
    }
  }
});
