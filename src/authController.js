import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { ObjectId } from "mongodb";

export async function signIn(req, res) {
  const user = await db.collection("users").findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = uuid();

    const session = await db
      .collection("sessions")
      .findOne({ userId: new ObjectId(user._id) });
    if (!session) {
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
    } else {
      await db.collection("sessions").updateOne(
        {
          userId: user._id,
        },
        { $set: { token } }
      );
    }
    const resp = {
      token,
      name: user.name,
    };
    res.send(resp);
  } else {
    res.status(401).send({ message: "email ou senha invalidos" });
  }
}

export async function signUp(req, res) {
  const body = req.body;
  const isuser = await db.collection("users").findOne({ email: body.email });

  if (isuser) {
    return res.status(403).send({ message: "email ja cadastrado" });
  }

  const passwordHash = bcrypt.hashSync(body.password, 10);

  await db.collection("users").insertOne({ ...body, password: passwordHash });

  const user = await db.collection("users").findOne({ email: body.email });
  await db.collection("cart").insertOne({ id_user: user._id, cart: [] });
  const token = uuid();

  const session = await db
    .collection("sessions")
    .findOne({ userId: new ObjectId(user._id) });
  if (!session) {
    await db.collection("sessions").insertOne({
      userId: user._id,
      token,
    });
  } else {
    await db.collection("sessions").updateOne(
      {
        userId: user._id,
      },
      { $set: { token } }
    );
  }
  const resp = {
    token,
    name: user.name,
  };
  res.send(resp);
}
