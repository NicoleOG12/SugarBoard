import pool from "../config/bd.js";

class DocesDAO {
  async listar() {
    const [rows] = await pool.query(`
      SELECT 
        d.id,
        d.nome,
        d.subtitulo,
        d.valor,
        d.peso,
        d.imagem,
        d.estoque,
        c.nome AS categoria_nome
      FROM doces d
      LEFT JOIN categorias c ON d.categoria_id = c.id
      ORDER BY d.id DESC
    `);
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(`
      SELECT 
        d.id,
        d.nome,
        d.subtitulo,
        d.valor,
        d.peso,
        d.imagem,
        d.estoque,
        c.nome AS categoria_nome
      FROM doces d
      LEFT JOIN categorias c ON d.categoria_id = c.id
      WHERE d.id = ?
    `, [id]);
    return rows[0];
  }

  async criar(dados) {
    const { nome, subtitulo, valor, peso, imagem, estoque, categoria_id } = dados;
    const [result] = await pool.query(`
      INSERT INTO doces (nome, subtitulo, valor, peso, imagem, estoque, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nome, subtitulo, valor, peso, imagem, estoque, categoria_id]);
    return { id: result.insertId, ...dados };
  }

  async atualizar(id, dados) {
    const { nome, subtitulo, valor, peso, imagem, estoque, categoria_id } = dados;
    const [result] = await pool.query(`
      UPDATE doces
      SET nome = ?, subtitulo = ?, valor = ?, peso = ?, imagem = ?, estoque = ?, categoria_id = ?
      WHERE id = ?
    `, [nome, subtitulo, valor, peso, imagem, estoque, categoria_id, id]);
    return result.affectedRows > 0;
  }

  async deletar(id) {
    const [result] = await pool.query(`DELETE FROM doces WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

export default new DocesDAO();
