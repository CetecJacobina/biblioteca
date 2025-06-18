async function carregarDados() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfeYZcj2OA5_SibuvUhd3dnteXMbb0Xf1m42fpJVz3OkzQr9QMuxIJbQb_jvqcVoR3Md-YucAqIIdV/pub?output=csv";

  try {
    const res = await fetch(url);
    const texto = await res.text();
    const linhas = texto.trim().split("\n");
    const cabecalho = linhas[0].split(",");
    const dados = linhas.slice(1).map(l => {
      const valores = l.split(",");
      const obj = {};
      cabecalho.forEach((c, i) => obj[c.trim()] = valores[i]?.trim());
      return obj;
    });

    console.log("Dados carregados:", dados); // Debug

    const container = document.getElementById("acervo");
    container.innerHTML = "";

    dados.forEach(item => {
     const caminhoCapa = item["Capa"] ? `../assets/capas/${item["Capa"].replace(/\s/g, '%20')}` : "../testes/img/default.jpg";

      console.log("Caminho da capa:", caminhoCapa); // Debug

      const div = document.createElement("div");
      div.className = "icone-livro";

      div.innerHTML = `
        <div class="card">
          <img src="${caminhoCapa}" class="capa-livro" alt="Capa de ${item["Título"]}" onclick="window.open('${item["Link"]}', '_blank')">
          <div class="info-livro">
            <h3>${item["Título"]}</h3>
            <p><strong>Autor:</strong> ${item["Autor"]}</p>
            <button class="descricao-btn" onclick="mostrarDescricao('${item["Título"].replace(/\s/g, '-')}')">Ver Descrição</button>
          </div>
          <div class="descricao-popup" id="descricao-${item["Título"].replace(/\s/g, '-')}">
            <p>${item["Descrição"]}</p>
            <button onclick="fecharDescricao('${item["Título"].replace(/\s/g, '-')}')">Fechar</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

  } catch (e) {
    console.error("Erro ao carregar planilha:", e);
    document.getElementById("acervo").innerText = "Erro ao carregar os dados.";
  }
}

function mostrarDescricao(id) {
  const popup = document.getElementById(`descricao-${id.replace(/\s/g, '-')}`);
  if (popup) popup.style.display = "block";
}

function fecharDescricao(id) {
  const popup = document.getElementById(`descricao-${id.replace(/\s/g, '-')}`);
  if (popup) popup.style.display = "none";
}

carregarDados();