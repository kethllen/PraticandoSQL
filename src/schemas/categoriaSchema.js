import joi from "joi";
const categoriaSchema = joi.object({
  nome: joi.string().required(),
});

export default categoriaSchema;
