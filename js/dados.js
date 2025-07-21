// dados.js
window.dados = [];

function parseCsvLinhaComAspas(linha) {
  const resultado = [];
  let campo = '';
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const char = linha[i];
    const proximo = linha[i + 1];

    if (char === '"' && dentroDeAspas && proximo === '"') {
      campo += '"';
      i++;
    } else if (char === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (char === ',' && !dentroDeAspas) {
      resultado.push(campo.trim());
      campo = '';
    } else {
      campo += char;
    }
  }
  resultado.push(campo.trim());
  return resultado;
}

async function carregarDados() {
  if (window.dados.length > 0) return;

  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTooQzjQ8ocBjbY9tptkCuJ6vEOktUBsmUaiqY8QU1Yegh2M_MLOs8zeVJtno0T2qy-Bc4aBUSubvOC/pubhtml";

  try {
    const res = await fetch(url);
    const texto = await res.text();
    const linhas = texto.trim().split("\n");
    const cabecalho = linhas[0].split(",");

    window.dados = linhas.slice(1).map(l => {
      const valores = parseCsvLinhaComAspas(l);
      const obj = {};
      cabecalho.forEach((c, i) => (obj[c.trim()] = valores[i]?.trim()));
      return obj;
    });

    console.log("✅ Dados carregados em dados.js:", window.dados);
  } catch (e) {
    console.error("❌ Erro ao carregar a planilha:", e);
    document.getElementById("acervo").innerText = "Erro ao carregar os dados.";
  }
}

function exibirCards(lista) {
  const container = document.getElementById("acervo");
  container.innerHTML = "";

  lista.forEach(item => {
    const nomeImagem = item["Nome da Capa"];
    const caminhoCapa = nomeImagem
      ? `https://drive.google.com/uc?export=view&id=${nomeImagem}`
      : "https://raw.githubusercontent.com/CetecJacobina/biblioteca/refs/heads/main/assets/capas/default.jpg";

    const tokenLivro = item["TokenLivro"];

    const div = document.createElement("div");
    div.className = "icone-livro";

    div.innerHTML = `
      <div class="card">
        <img loading="lazy"
             src="${caminhoCapa}"
             class="capa-livro"
             alt="Capa de ${item["Título"]}"
             onclick="window.location.href='visualizar.html?token=${tokenLivro}'">

        <div class="info-livro">
          <h3>${item["Título"]}</h3>
          <p><strong>Autor:</strong> ${item["Autor"]}</p>
          <button class="descricao-btn" onclick="window.location.href='descricao.html?token=${tokenLivro}'">Ver Descrição</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}