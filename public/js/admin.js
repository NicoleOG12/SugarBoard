const API_URL = "/api/doces";
const tabela = document.getElementById("tabela");
const modalBg = document.getElementById("modalBg");
const form = document.getElementById("formProduto");
const btnAdd = document.getElementById("btnAdd");
const closeModal = document.getElementById("closeModal");
const search = document.getElementById("search");
const totalProdutosEl = document.getElementById("totalProdutos");
const totalCategoriasEl = document.getElementById("totalCategorias");
const valorTotalEl = document.getElementById("valorTotal");
const categoriaSelect = document.getElementById("categoria_id");
const imagemInput = document.getElementById("imagem");
const previewImg = document.getElementById("preview-img");
const btnCancel = document.getElementById("btnCancel");

let produtos = [];
let categorias = [];
let editando = null;

imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.classList.add("show");
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = "https://via.placeholder.com/250x250?text=Prévia";
    previewImg.classList.remove("show");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nome", nome.value);
  formData.append("subtitulo", subtitulo.value);
  formData.append("valor", valor.value);
  formData.append("peso", peso.value);
  formData.append("estoque", estoque.value);
  formData.append("categoria_id", categoria_id.value);

  if (imagemInput.files[0]) {
    formData.append("imagem", imagemInput.files[0]);
  }

  const method = editando ? "PUT" : "POST";
  const url = editando ? `${API_URL}/${editando}` : API_URL;

  await fetch(url, {
    method,
    body: formData,
  });

  modalBg.style.display = "none";
  carregarTudo();
});

btnCancel.addEventListener("click", () => {
  modalBg.style.display = "none";
});

btnAdd.addEventListener("click", async () => {
  form.reset();
  editando = null;
  previewImg.src = "https://via.placeholder.com/250x250?text=Prévia";
  previewImg.classList.remove("show");
  document.getElementById("modalTitle").textContent = "Adicionar Produto";
  if (!categorias.length) await carregarCategorias();
  if (categoriaSelect.options.length > 0) categoriaSelect.selectedIndex = 0;
  modalBg.style.display = "flex";
});

closeModal.addEventListener("click", () => (modalBg.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modalBg) modalBg.style.display = "none";
});

async function carregarTudo() {
  await Promise.all([carregarCategorias(), carregarProdutos()]);
  atualizarCards();
}

async function carregarCategorias() {
  try {
    const res = await fetch("/api/doces/categorias");
    categorias = await res.json();
    categoriaSelect.innerHTML = categorias
      .map((c) => `<option value="${c.id}">${c.nome}</option>`)
      .join("");
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}

async function carregarProdutos() {
  try {
    const res = await fetch(API_URL);
    produtos = await res.json();
    renderizarTabela(produtos);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

function renderizarTabela(lista) {
  tabela.innerHTML = "";
  lista.forEach((p) => {
    const cat = p.categoria_nome || "—";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.imagem}" alt="${p.nome}" class="thumb"></td>
      <td>${p.nome}</td>
      <td>${p.subtitulo || "—"}</td>
      <td>R$ ${parseFloat(p.valor).toFixed(2)}</td>
      <td>${p.peso || "—"}</td>
      <td>${p.estoque}</td>
      <td>${cat}</td>
      <td>
        <button class="btn-edit" data-id="${p.id}"><i data-lucide="edit"></i></button>
        <button class="btn-delete" data-id="${p.id}"><i data-lucide="trash-2"></i></button>
      </td>
    `;
    tabela.appendChild(tr);
  });
  lucide.createIcons();
  configurarBotoes();
}

function configurarBotoes() {
  document.querySelectorAll(".btn-edit").forEach((b) =>
    b.addEventListener("click", (e) =>
      abrirEdicao(e.target.closest("button").dataset.id)
    )
  );
  document.querySelectorAll(".btn-delete").forEach((b) =>
    b.addEventListener("click", (e) =>
      deletarProduto(e.target.closest("button").dataset.id)
    )
  );
}

async function abrirEdicao(id) {
  const p = produtos.find((x) => x.id == id);
  if (!p) return;

  if (!categorias.length) {
    await carregarCategorias();
  }

  editando = id;
  document.getElementById("modalTitle").textContent = "Editar Produto";
  document.getElementById("id").value = p.id;
  document.getElementById("nome").value = p.nome;
  document.getElementById("subtitulo").value = p.subtitulo || "";
  document.getElementById("valor").value = p.valor;
  document.getElementById("peso").value = p.peso || "";
  document.getElementById("estoque").value = p.estoque;

  const categoriaId = String(p.categoria_id || "");
  const optionExiste = [...categoriaSelect.options].some(
    (opt) => opt.value === categoriaId
  );

  if (optionExiste) {
    categoriaSelect.value = categoriaId;
  } else {
    const opt = document.createElement("option");
    opt.value = categoriaId;
    opt.textContent = p.categoria_nome || "Categoria desconhecida";
    categoriaSelect.appendChild(opt);
    categoriaSelect.value = categoriaId;
  }

  if (p.imagem) {
    previewImg.src = p.imagem;
    previewImg.classList.add("show");
  } else {
    previewImg.src = "https://via.placeholder.com/250x250?text=Prévia";
    previewImg.classList.remove("show");
  }

  modalBg.style.display = "flex";
}

const confirmModal = document.getElementById("confirmModal");
const confirmMessage = document.getElementById("confirmMessage");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

async function deletarProduto(id) {
  return new Promise((resolve) => {
    confirmMessage.textContent = "Deseja realmente excluir este produto? ";
    confirmModal.style.display = "flex";

    const limpar = () => {
      confirmYes.removeEventListener("click", onYes);
      confirmNo.removeEventListener("click", onNo);
      confirmModal.style.display = "none";
    };

    const onYes = async () => {
      limpar();
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      carregarTudo();
      resolve(true);
    };

    const onNo = () => {
      limpar();
      resolve(false);
    };

    confirmYes.addEventListener("click", onYes);
    confirmNo.addEventListener("click", onNo);
  });
}


search.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(termo) ||
      (p.subtitulo && p.subtitulo.toLowerCase().includes(termo))
  );
  renderizarTabela(filtrados);
});

function animarContador(elemento, valorFinal, duracao = 800) {
  let inicio = 0;
  const incremento = valorFinal / (duracao / 16);
  const atualizar = () => {
    inicio += incremento;
    if (inicio < valorFinal) {
      elemento.textContent = Math.floor(inicio);
      requestAnimationFrame(atualizar);
    } else {
      elemento.textContent = valorFinal;
    }
  };
  atualizar();
}

function atualizarCards() {
  const totalProdutos = produtos.length;
  const totalCategorias = categorias.length;
  const totalValor = produtos.reduce(
    (acc, p) => acc + parseFloat(p.valor || 0),
    0
  );

  animarContador(totalProdutosEl, totalProdutos);
  animarContador(totalCategoriasEl, totalCategorias);
  animarContador(valorTotalEl, Math.floor(totalValor));
}

carregarTudo();
