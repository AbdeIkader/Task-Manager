import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid("Text", "List").required(),
  items: Joi.array().items(Joi.string()).optional(),
  isShared: Joi.boolean().required(),
  category: Joi.string().length(24).hex().required()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  type: Joi.string().valid("Text", "List").optional(),
  content: Joi.string().optional(),
  items: Joi.array().items(Joi.string()).optional(),
  isShared: Joi.boolean().optional(),
  category: Joi.string().length(24).hex().optional()
});
