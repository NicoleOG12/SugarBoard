import docesDAO from "../dao/docesDAO.js";
import pool from "../config/bd.js"; 

export const listarDoces = async (req, res) => {
  try {
    const doces = await docesDAO.listar();
    res.json(doces);
  } catch (error) {
    console.error("❌ ERRO AO LISTAR DOCES:", error); 
    res.status(500).json({ error: error.message });
  }
};


export const buscarDoce = async (req, res) => {
  try {
    const doce = await docesDAO.buscarPorId(req.params.id);
    if (!doce) return res.status(404).json({ message: "Doce não encontrado" });
    res.json(doce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criarDoce = async (req, res) => {
  try {
    let imagem = null;

    if (req.file) {
      imagem = `/uploads/${req.file.filename}`;
    } else if (req.body.imagem) {
      imagem = req.body.imagem;
    }

    const novoDoce = await docesDAO.criar({
      ...req.body,
      imagem
    });

    res.status(201).json(novoDoce);
  } catch (error) {
    console.error("❌ ERRO AO CRIAR DOCE:", error);
    res.status(500).json({ error: error.message });
  }
};

export const atualizarDoce = async (req, res) => {
  try {
    let imagem = null;

    if (req.file) {
      imagem = `/uploads/${req.file.filename}`;
    } else if (req.body.imagem) {
      imagem = req.body.imagem;
    }

    const atualizado = await docesDAO.atualizar(req.params.id, {
      ...req.body,
      imagem
    });

    if (!atualizado) return res.status(404).json({ message: "Doce não encontrado" });
    res.json({ message: "Atualizado com sucesso" });
  } catch (error) {
    console.error("❌ ERRO AO ATUALIZAR DOCE:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deletarDoce = async (req, res) => {
  try {
    const deletado = await docesDAO.deletar(req.params.id);
    if (!deletado) return res.status(404).json({ message: "Doce não encontrado" });
    res.json({ message: "Removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query("SELECT * FROM categorias ORDER BY nome");
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
