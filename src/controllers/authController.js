import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "../db.js";

export async function signIn(req, res) {
  const user = await connection.query(
    `
  SELECT * FROM usuarios
  WHERE email=($1)
  `,
    [req.body.email]
  );

  if (user.rowCount > 0 && bcrypt.compareSync(req.body.senha, user.senha)) {
    const token = uuid();

    const session = await connection.query(`
      SELECT * FROM sessoes WHERE "idUsuario"=${user.id}
    `);
    if (session.rowCount == 0) {
      await connection.query(
        `INSERT INTO sessions ("idUsuario", token)
          VALUER ($1, $2)`,
        [user.id, token]
      );
    } else {
      await connection.query(` UPDATE sessions
      SET token=${token}
      WHERE id=${user.id}
  `);
    }
    const resp = {
      token,
      name: user.nome,
    };
    res.send(resp);
  } else {
    res.status(401).send({ message: "email ou senha invalidos" });
  }
}

export async function signUp(req, res) {
  const body = req.body;
  const user = await connection.query(
    `
  SELECT * FROM usuarios
  WHERE email=($1)
  `,
    [body.email]
  );

  if (user.rowCount > 0) {
    return res.status(403).send({ message: "email ja cadastrado" });
  }

  const passwordHash = bcrypt.hashSync(body.senha, 10);
  await connection.query(
    `INSERT INTO usuarios (nome, email, senha)
          VALUER ($1, $2, $3)`,
    [body.nome, body.email, passwordHash]
  );

  return res.sendStatus(201);
}
