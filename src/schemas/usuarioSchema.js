import joi from "joi";
const usuarioSchema = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().required(),
});

export default usuarioSchema;
