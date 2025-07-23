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
    const pendenteTarefa = tarefas.some(tarefa => {
      const prazo = new Date(tarefa.prazo);
      return tarefa.status !== "concluida" && prazo < hoje;
    });

    const pendenteMeta = metas.some(meta => {
      const prazo = new Date(meta.prazo);
      return meta.status !== "concluida" && prazo < hoje;
    });

    if (pendenteTarefa || pendenteMeta) {
      containerAviso.classList.remove("hidden");
    }
  }
});
