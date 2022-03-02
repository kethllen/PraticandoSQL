import connection from "../db.js";

export async function getProdutos(req, res) {
  try {
    const { rows: produtos } =
      await connection.query(`SELECT produtos.*,usuarios.nome AS "nomeUsuario" FROM produtos 
    JOIN usuarios ON usuarios.id="produtos.idUsuario" `);

    res.send(produtos);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function criarProduto(req, res) {
  try {
    const { nome, preco } = req.body;
    const { user } = res.locals;
    const result = await connection.query(
      `SELECT id FROM produtos WHERE nome=$1`,
      [nome]
    );
    if (result.rows.length > 0) {
      return res.status(409).send("Produto já cadastrado");
    }

    await connection.query(
      `
      INSERT INTO produtos (nome, preco, "idUsuario")
        VALUES ($1, $2, $3)
    `,
      [nome, preco, user.id]
    );

    res.sendStatus(201);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function deletarProduto(req, res) {
  const { id } = req.params;
  const { user } = res.locals;
  try {
    const usuario = await connection.query(
      `SELECT * FROM produtos WHERE id=$1 and "idUsuario"=$2`,
      [id, user.id]
    );
    if (usuario.rows.length > 0) {
      return res
        .status(400)
        .send("Você não pode deletar um produto que não te pertence!");
    }
    await connection.query(
      `
      DELETE FROM produtos WHERE id=$1
    `,
      [id]
    );

    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { user } = res.locals;
    const { nome, preco } = req.body;
    const usuario = await connection.query(
      `SELECT * FROM produtos WHERE id=$1 and "idUsuario"=$2`,
      [id, user.id]
    );
    if (usuario.rows.length > 0) {
      return res
        .status(400)
        .send("Você não pode atualizar um produto que não te pertence!");
    }
    await connection.query(
      `
      UPDATE produtos
        SET nome=$1, preco=$2
        WHERE id=$3
    `,
      [nome, preco, user.id]
    );

    res.sendStatus(200);
  } catch (erro) {
    res.status(500).send(erro);
  }
}
