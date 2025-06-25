let paginaAtual = 1;
const itensPorPagina = 15;

function exibirPagina(pagina, fonte = window.dados) {
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = fonte.slice(inicio, fim);

  exibirCards(itensPagina); // delega a renderização visual
}

function atualizarControlesPaginacao(fonte = window.dados) {
  const controls = document.getElementById("pagination-controls");
  controls.innerHTML = "";

  const totalPaginas = Math.ceil(fonte.length / itensPorPagina);

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => {
    paginaAtual--;
    exibirPagina(paginaAtual, fonte);
    atualizarControlesPaginacao(fonte);
  };

  const btnProxima = document.createElement("button");
  btnProxima.textContent = "Próxima";
  btnProxima.disabled = paginaAtual === totalPaginas;
  btnProxima.onclick = () => {
    paginaAtual++;
    exibirPagina(paginaAtual, fonte);
    atualizarControlesPaginacao(fonte);
  };

  controls.appendChild(btnAnterior);
  controls.appendChild(document.createTextNode(` Página ${paginaAtual} de ${totalPaginas} `));
  controls.appendChild(btnProxima);
}