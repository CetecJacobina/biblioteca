async function renderizarPDF(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;

  const pagina = await pdf.getPage(1);

  const viewport = pagina.getViewport({ scale: 1.5 });
  const canvas = document.getElementById('canvas-pdf');
  const context = canvas.getContext('2d');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await pagina.render(renderContext).promise;
}

// Captura o ID pela URL (ex: visualizar.html?id=1XYZ123)
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  renderizarPDF(url);
} else {
  alert("Nenhum PDF especificado na URL.");
}
