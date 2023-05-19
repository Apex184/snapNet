import Joi from 'joi';

// Joi schema for input validation
export const createAdminUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});