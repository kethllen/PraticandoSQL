import connection from "../db.js";

export default async function validaTokenMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("nao tenho token");
    }

    const session = await await connection.query(
      `
      SELECT * FROM sessoes WHERE token=($1)
    `,
      [token]
    );
    if (session.rowCount == 0) {
      return res.status(401).send({ message: "sessao nao encontrada" });
    }

    const participant = await connection.query(
      `
    SELECT * FROM usuarios
    WHERE id=($1)
    `,
      [session.idUsuario]
    );
    if (participant.rowCount == 0) {
      return res.status(401).send({ message: "usuario nao encontrado" });
    }

    res.locals.user = participant;

    next();
  } catch (error) {
    res.sendStatus(500);
  }
}
