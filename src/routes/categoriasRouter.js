import { Router } from "express";
import {
  getCategorias,
  criarCategoria,
  deletarCategoria,
  atualizarCategoria,
} from "../controllers/categoriasController.js";
import validaSchemaMiddleware from "../middlewares/validaSchemaMiddleware.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";
import categoriaSchema from "../schemas/categoriaSchema.js";

const categoriasRouter = Router();
categoriasRouter.get("/categorias", getCategorias);
categoriasRouter.put(
  "/categorias/:id",
  validaTokenMiddleware,
  atualizarCategoria
);
categoriasRouter.post(
  "/categorias",
  validaTokenMiddleware,
  validaSchemaMiddleware(categoriaSchema),
  criarCategoria
);
categoriasRouter.delete(
  "/categorias/:id",
  validaTokenMiddleware,
  deletarCategoria
);

export default categoriasRouter;
