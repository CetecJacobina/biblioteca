// dados.js
window.dados = [];

async function carregarDados() {
  if (window.dados.length > 0) return; // evita carregamento duplicado

  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfeYZcj2OA5_SibuvUhd3dnteXMbb0Xf1m42fpJVz3OkzQr9QMuxIJbQb_jvqcVoR3Md-YucAqIIdV/pub?output=csv";

  try {
    const res = await fetch(url);
    const texto = await res.text();
    const linhas = texto.trim().split("\n");
    const cabecalho = linhas[0].split(",");

    window.dados = linhas.slice(1).map(l => {
      const valores = l.split(",");
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