function exibirCards(lista) {
  const container = document.getElementById("acervo");
  container.innerHTML = "";

  lista.forEach(item => {
    const nomeImagem = item["Capa"];
    const caminhoCapa = nomeImagem
      ? `https://raw.githubusercontent.com/CetecJacobina/biblioteca/refs/heads/main/assets/capas/${encodeURIComponent(nomeImagem)}`
      : "https://raw.githubusercontent.com/CetecJacobina/biblioteca/refs/heads/main/assets/capas/default.jpg";

    const idDescricao = `descricao-${item["Título"].replace(/\s/g, '-')}`;
    const div = document.createElement("div");
    div.className = "icone-livro";

    div.innerHTML = `
      <div class="card">
        <img loading="lazy" src="${caminhoCapa}" class="capa-livro" alt="Capa de ${item["Título"]}" onclick="window.open('${item["Link"]}', '_blank')">
        <div class="info-livro">
          <h3>${item["Título"]}</h3>
          <p><strong>Autor:</strong> ${item["Autor"]}</p>
          <button class="descricao-btn" data-target="${idDescricao}">Ver Descrição</button>
        </div>
        <div class="descricao-popup" id="${idDescricao}">
          <p>${item["Descrição"] || "Descrição não disponível."}</p>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  // Configura interações após os elementos serem renderizados
  document.querySelectorAll(".descricao-btn").forEach(botao => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("data-target");
      const popup = document.getElementById(id);
      const isVisible = popup.style.display === "block";
      
      // Fecha todos primeiro
      document.querySelectorAll(".descricao-popup").forEach(p => p.style.display = "none");

      // Só mostra se não estava visível
      if (!isVisible) popup.style.display = "block";
    });
  });

  // Fecha a descrição ao clicar fora
  document.addEventListener("click", e => {
    const isPopup = e.target.closest(".descricao-popup");
    const isBotao = e.target.closest(".descricao-btn");
    if (!isPopup && !isBotao) {
      document.querySelectorAll(".descricao-popup").forEach(p => p.style.display = "none");
    }
  });
}