// helpers.js
export function normalizarCategoria(categoria) {
  if (!categoria) return 'outros';
  return categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
