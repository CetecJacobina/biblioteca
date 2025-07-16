const form = document.getElementById("formLivro");
const usarCapaManual = document.getElementById("usarCapaManual");
const campoCapa = document.getElementById("campoCapa");

usarCapaManual.addEventListener("change", () => {
  campoCapa.style.display = usarCapaManual.checked ? "block" : "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resultado = document.getElementById("resultado");
  resultado.innerText = "⏳ Enviando...";

  const formData = new FormData(form);
  const token = document.getElementById("campoToken").value.trim();

  const pdfFile = formData.get("pdf");
  const pdfBase64 = await toBase64(pdfFile);

  let capaBase64 = "";

  if (usarCapaManual.checked) {
    const capaFile = formData.get("capa");
    if (!capaFile) {
      resultado.innerText = "❌ Nenhuma capa enviada.";
      return;
    }
    capaBase64 = await toBase64(capaFile);
    capaBase64 = capaBase64.replace(/^data:image\/(jpeg|png);base64,/, "");
  } else {
    capaBase64 = await extrairImagemDaPrimeiraPagina(pdfFile);
    if (!capaBase64) {
      resultado.innerText = "❌ Falha ao extrair imagem do PDF.";
      return;
    }
  }

  const dados = {
    token: token,
    acao: "cadastrar",
    titulo: formData.get("titulo"),
    autor: formData.get("autor"),
    categoria: formData.get("categoria"),
    descricao: formData.get("descricao"),
    pdfBase64: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
    capaBase64: capaBase64
  };

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbxzA2CP1baCmzCTfDq8oyjbkLYzMZ9qf4ibTeZ0gfbmuSgd6SYo-urjD2VB-i8GGCd3bw/exec", {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const texto = await resposta.text();
    resultado.innerText = texto;
    form.reset();
    campoCapa.style.display = "none";
  } catch (erro) {
    console.error(erro);
    resultado.innerText = "❌ Erro ao enviar livro.";
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}

async function extrairImagemDaPrimeiraPagina(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;

        const base64Image = canvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
        resolve(base64Image);
      } catch (err) {
        console.error("Erro ao extrair imagem do PDF:", err);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
