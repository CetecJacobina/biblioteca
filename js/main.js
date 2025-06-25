// main.js

// 1. Inicia o carregamento da planilha
carregarDados();

// 2. Aguarda os dados estarem prontos
const iniciarApp = setInterval(() => {
  if (window.dados && window.dados.length > 0) {
    clearInterval(iniciarApp);

    // 3. Exibe a página inicial
    exibirPagina(1, window.dados);
    atualizarControlesPaginacao(window.dados);

    // 4. Preenche o filtro de categorias
    preencherCategorias();

    // 5. Configura os eventos de filtro (se filtro.js já os registrou, isso é opcional)
    // Os próprios listeners de filtro.js já escutam mudanças automaticamente

    console.log("📚 Aplicação iniciada com sucesso!");
  }
}, 100);