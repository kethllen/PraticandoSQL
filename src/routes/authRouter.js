import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import signInSchema from "../schemas/signinSchema.js";
import usuarioSchema from "../schemas/usuarioSchema.js";
import validaSchemaMiddleware from "../middlewares/validaSchemaMiddleware.js";

const authRouter = Router();
authRouter.post("/sign-in", validaSchemaMiddleware(signInSchema), signIn);
authRouter.post("/sign-up", validaSchemaMiddleware(usuarioSchema), signUp);

export default authRouter;
