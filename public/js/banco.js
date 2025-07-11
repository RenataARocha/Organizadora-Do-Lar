// banco.js — versão para o navegador
export async function abrirBanco() {
  console.log("Simulando banco no navegador.");
}

export async function salvarTarefa(titulo, descricao, data) {
  const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
  tarefas.push({ titulo, descricao, data });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

export async function listarTarefas() {
  return JSON.parse(localStorage.getItem("tarefas") || "[]");
}
