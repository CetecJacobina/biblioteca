let dadosFiltrados = [];
let termoBusca = "";
let categoriaSelecionada = "";

// 🔎 Atualiza o array filtrado com base no termo e na categoria
function filtrarDados() {
  if (!window.dados || window.dados.length === 0) return;

  dadosFiltrados = window.dados.filter(item => {
    const termo = termoBusca.toLowerCase();
    const titulo = item["Título"]?.toLowerCase() || "";
    const autor = item["Autor"]?.toLowerCase() || "";
    const categoria = item["Categoria"]?.toLowerCase() || "";

    const correspondeBusca =
      titulo.includes(termo) || autor.includes(termo) || categoria.includes(termo);
    const correspondeCategoria =
      !categoriaSelecionada || categoria === categoriaSelecionada.toLowerCase();

    return correspondeBusca && correspondeCategoria;
  });

  paginaAtual = 1;
  exibirPagina(paginaAtual, dadosFiltrados);
  atualizarControlesPaginacao(dadosFiltrados);
}

// 🧠 Preenche o <select> com categorias únicas
function preencherCategorias() {
  const select = document.getElementById("categoriaFiltro");
  select.innerHTML = ""; // limpa as opções anteriores

  // Adiciona a opção "Todas as categorias"
  const opcaoTodas = document.createElement("option");
  opcaoTodas.value = "";
  opcaoTodas.textContent = "Todas as categorias";
  select.appendChild(opcaoTodas);

  // Adiciona as categorias únicas
  const categorias = [...new Set(window.dados.map(i => i["Categoria"]).filter(Boolean))].sort();
  categorias.forEach(cat => {
    const op = document.createElement("option");
    op.value = cat;
    op.textContent = cat;
    select.appendChild(op);
  });
}

// 🎯 Eventos
document.getElementById("campoBusca").addEventListener("input", e => {
  termoBusca = e.target.value.trim();
  filtrarDados();
});

document.getElementById("categoriaFiltro").addEventListener("change", e => {
  categoriaSelecionada = e.target.value.trim();
  filtrarDados();
});

// 💡 Aguarda dados carregados
const aguardarDados = setInterval(() => {
  if (window.dados && window.dados.length > 0) {
    clearInterval(aguardarDados);
    dadosFiltrados = [...window.dados];
    preencherCategorias();
    exibirPagina(paginaAtual, dadosFiltrados);
    atualizarControlesPaginacao(dadosFiltrados);
  }
}, 100);