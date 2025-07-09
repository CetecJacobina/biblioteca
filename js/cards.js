function extrairIdDrive(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  return match ? match[1] : '';
}

function exibirCards(lista) {
  const container = document.getElementById("acervo");
  container.innerHTML = "";

  lista.forEach(item => {
    const nomeImagem = item["Capa"];
    const caminhoCapa = nomeImagem
      ? `https://raw.githubusercontent.com/CetecJacobina/biblioteca/refs/heads/main/assets/capas/${encodeURIComponent(nomeImagem)}`
      : "https://raw.githubusercontent.com/CetecJacobina/biblioteca/refs/heads/main/assets/capas/default.jpg";

    const idLivro = extrairIdDrive(item["Link"]);

    const div = document.createElement("div");
    div.className = "icone-livro";

    div.innerHTML = `
      <div class="card">
        <img loading="lazy"
             src="${caminhoCapa}"
             class="capa-livro"
             alt="Capa de ${item["Título"]}"
             onclick="window.location.href='visualizar.html?id=${idLivro}'">

        <div class="info-livro">
          <h3>${item["Título"]}</h3>
          <p><strong>Autor:</strong> ${item["Autor"]}</p>
          <button class="descricao-btn" onclick="window.location.href='descricao.html?id=${idLivro}'">Ver Descrição</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}
