import { Router } from "express";
import authRouter from "./authRouter.js";
import productsRouter from "./productsRouter.js";
import categoriasRouter from "./categoriasRouter.js";

const router = Router();
router.use(authRouter);
router.use(productsRouter);
router.use(categoriasRouter);

export default router;
