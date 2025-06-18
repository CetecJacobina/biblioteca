let dadosFiltrados = [];
let termoBusca = "";
let categoriaSelecionada = "";

// 🔎 Atualiza o array filtrado com base no termo e na categoria
function filtrarDados() {
  dadosFiltrados = dados.filter(item => {
    const termo = termoBusca.toLowerCase();
    const titulo = item["Título"]?.toLowerCase() || "";
    const autor = item["Autor"]?.toLowerCase() || "";
    const categoria = item["Categoria"]?.toLowerCase() || "";

    const correspondeBusca = titulo.includes(termo) || autor.includes(termo) || categoria.includes(termo);
    const correspondeCategoria = !categoriaSelecionada || categoria === categoriaSelecionada.toLowerCase();

    return correspondeBusca && correspondeCategoria;
  });

  paginaAtual = 1;
  exibirPagina(paginaAtual, dadosFiltrados);
  atualizarControlesPaginacao(dadosFiltrados);
}

// 🧠 Preenche automaticamente o select com as categorias disponíveis
function preencherCategorias() {
  const select = document.getElementById("categoriaFiltro");
  const categorias = [...new Set(dados.map(i => i["Categoria"]).filter(Boolean))].sort();

  categorias.forEach(cat => {
    const op = document.createElement("option");
    op.value = cat;
    op.textContent = cat;
    select.appendChild(op);
  });
}

// 🎯 Listeners
document.getElementById("campoBusca").addEventListener("input", e => {
  termoBusca = e.target.value.trim();
  filtrarDados();
});

document.getElementById("categoriaFiltro").addEventListener("change", e => {
  categoriaSelecionada = e.target.value.trim();
  filtrarDados();
});

// 💡 Se já carregou os dados, preenche categorias e exibe todos os itens por padrão
const aguardarDados = setInterval(() => {
  if (dados && dados.length > 0) {
    clearInterval(aguardarDados);
    dadosFiltrados = [...dados];
    preencherCategorias();
    exibirPagina(paginaAtual, dadosFiltrados);
    atualizarControlesPaginacao(dadosFiltrados);
  }
}, 100);