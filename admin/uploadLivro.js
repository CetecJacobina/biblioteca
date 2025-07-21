// Configura o worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Alterna exibição do campo de capa
document.getElementById("usarCapaManual").addEventListener("change", (e) => {
  const campoCapa = document.getElementById("campoCapa");
  campoCapa.style.display = e.target.checked ? "block" : "none";
});

// Manipulação do envio do formulário
document.getElementById("formLivro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const resultado = document.getElementById("resultado");
  resultado.innerText = "⏳ Enviando...";

  const form = e.target;
  const formData = new FormData(form);

  const pdfFile = formData.get("pdf");
  const usarCapaManual = document.getElementById("usarCapaManual").checked;

  const pdfBase64 = await toBase64(pdfFile);
  formData.append("pdfBase64", pdfBase64.replace(/^data:application\/pdf;base64,/, ""));

  if (usarCapaManual) {
    const capaFile = formData.get("capa");
    if (!capaFile || capaFile.size === 0) {
      resultado.innerText = "❌ Arquivo de capa não enviado.";
      return;
    }
    const capaBase64 = await toBase64(capaFile);
    formData.append("capaBase64", capaBase64.replace(/^data:image\/(jpeg|png);base64,/, ""));
  } else {
    const capaBase64 = await extrairImagemDaPrimeiraPagina(pdfFile);
    formData.append("capaBase64", capaBase64.replace(/^data:image\/jpeg;base64,/, ""));
  }

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbxzA2CP1baCmzCTfDq8oyjbkLYzMZ9qf4ibTeZ0gfbmuSgd6SYo-urjD2VB-i8GGCd3bw/exec", {
      method: "POST",
      body: formData
    });

    const texto = await resposta.text();
    resultado.innerText = texto;
    form.reset();
    document.getElementById("campoCapa").style.display = "none";
  } catch (err) {
    console.error(err);
    resultado.innerText = "❌ Erro ao enviar livro.";
  }
});

// Utilitário: converter arquivo para base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Utilitário: extrair imagem da primeira página do PDF
async function extrairImagemDaPrimeiraPagina(file) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);

  const scale = 2.5;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/jpeg");
}