import connection from "../db.js";

export async function getCategorias(req, res) {
  try {
    const { rows: categorias } = await connection.query(
      `SELECT * FROM categorias `
    );

    res.send(categorias);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function criarCategoria(req, res) {
  try {
    const { nome } = req.body;
    const { user } = res.locals;
    const result = await connection.query(
      `SELECT id FROM categorias WHERE nome=$1`,
      [nome]
    );
    if (result.rows.length > 0) {
      return res.status(409).send("Categoria já cadastrado");
    }

    await connection.query(
      `
      INSERT INTO categorias (nome)
        VALUES ($1)
    `,
      [nome]
    );

    res.sendStatus(201);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function deletarCategoria(req, res) {
  const { id } = req.params;

  try {
    await connection.query(
      `
      DELETE FROM categorias WHERE id=$1
    `,
      [id]
    );

    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function atualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    await connection.query(
      `
      UPDATE categorias
        SET nome=$1,
        WHERE id=$2
    `,
      [nome, id]
    );

    res.sendStatus(200);
  } catch (erro) {
    res.status(500).send(erro);
  }
}
