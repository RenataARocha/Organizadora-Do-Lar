// banco.js — versão atualizada para o navegador

export async function abrirBanco() {
  console.log("Simulando banco no navegador.");
}

export async function salvarTarefa(tarefa) {
  const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

export async function listarTarefas() {
  return JSON.parse(localStorage.getItem("tarefas") || "[]");
}

export async function removerTarefa(index) {
  const tarefas = await listarTarefas();
  tarefas.splice(index, 1);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}
