let dados = [];
let paginaAtual = 1;
const itensPorPagina = 15;

async function carregarDados() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfeYZcj2OA5_SibuvUhd3dnteXMbb0Xf1m42fpJVz3OkzQr9QMuxIJbQb_jvqcVoR3Md-YucAqIIdV/pub?output=csv";

  try {
    const res = await fetch(url);
    const texto = await res.text();
    const linhas = texto.trim().split("\n");
    const cabecalho = linhas[0].split(",");
    dados = linhas.slice(1).map(l => {
      const valores = l.split(",");
      const obj = {};
      cabecalho.forEach((c, i) => obj[c.trim()] = valores[i]?.trim());
      return obj;
    });

    console.log("Dados carregados:", dados);
    exibirPagina(paginaAtual);
    atualizarControlesPaginacao();

  } catch (e) {
    console.error("Erro ao carregar planilha:", e);
    document.getElementById("acervo").innerText = "Erro ao carregar os dados.";
  }
}

function exibirPagina(pagina, fonte = dados) {
  const container = document.getElementById("acervo");
  container.innerHTML = "";

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = fonte.slice(inicio, fim);

  itensPagina.forEach(item => {
    const caminhoCapa = item["Capa"] ? `../assets/capas/${item["Capa"].replace(/\s/g, '%20')}` : "../assets/capas/default.jpg";

    const div = document.createElement("div");
    div.className = "icone-livro";

    div.innerHTML = `
      <img src="${caminhoCapa}" class="capa-livro" alt="Capa de ${item["Título"]}" onclick="window.open('${item["Link"]}', '_blank')">
      <div class="info-livro">
        <h3>${item["Título"]}</h3>
        <p><strong>Autor:</strong> ${item["Autor"]}</p>
        <button class="descricao-btn" onclick="mostrarDescricao('${item["Título"].replace(/\s/g, '-')}')">Ver Descrição</button>
      </div>
      <div class="descricao-popup" id="descricao-${item["Título"].replace(/\s/g, '-')}">
        <p>${item["Descrição"] || "Descrição não disponível."}</p>
        <button onclick="fecharDescricao('${item["Título"].replace(/\s/g, '-')}')">Fechar</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function atualizarControlesPaginacao(fonte = dados) {
  const controls = document.getElementById("pagination-controls");
  controls.innerHTML = "";

  const totalPaginas = Math.ceil(fonte.length / itensPorPagina);

  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => {
    paginaAtual--;
    exibirPagina(paginaAtual, fonte);
    atualizarControlesPaginacao(fonte);
  };

  const btnProxima = document.createElement("button");
  btnProxima.innerText = "Próxima";
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

// Exibe descrição flutuante
function mostrarDescricao(id) {
  const popup = document.getElementById(`descricao-${id}`);
  if (popup) popup.style.display = "block";
}

// Fecha descrição flutuante
function fecharDescricao(id) {
  const popup = document.getElementById(`descricao-${id}`);
  if (popup) popup.style.display = "none";
}

carregarDados();