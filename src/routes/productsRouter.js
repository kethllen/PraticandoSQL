import { Router } from "express";
import {
  getProdutos,
  criarProduto,
  deletarProduto,
  atualizarProduto,
} from "../controllers/produtosController.js";
import validaSchemaMiddleware from "../middlewares/validaSchemaMiddleware.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";
import produtoSchema from "../schemas/produtoSchema.js";

const productsRouter = Router();
productsRouter.get("/produtos", getProdutos);
productsRouter.put("/produtos/:id", validaTokenMiddleware, atualizarProduto);
productsRouter.post(
  "/produtos",
  validaTokenMiddleware,
  validaSchemaMiddleware(produtoSchema),
  criarProduto
);
productsRouter.delete("/produtos/:id", validaTokenMiddleware, deletarProduto);

export default productsRouter;
