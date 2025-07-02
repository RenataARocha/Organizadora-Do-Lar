export function voltarParaHome() {
  window.location.href = 'tela-inicial.html';
}

export function criarBotaoVoltar() {
  const botao = document.createElement('button');
  botao.id = 'btn-voltar';
  botao.innerHTML = '← Voltar';
  botao.className =
    'relative w-full max-w-[500px] h-[47px] bg-pink-400 hover:bg-pink-300 text-white font-semibold rounded-[10px] mt-[22px] cursor-pointer shadow-md transition-all duration-300 ease-in-out overflow-hidden active:translate-y-1';
  botao.addEventListener('click', voltarParaHome);
  return botao;
}
