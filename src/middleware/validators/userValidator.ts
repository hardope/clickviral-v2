import Joi from "joi";

export const userValidator = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username: Joi.string().min(3).required(),
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        bio: Joi.string().min(3),
        profileImage: Joi.binary(),
        coverImage: Joi.binary(),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    update: Joi.object({
        email: Joi.forbidden(),
        password: Joi.forbidden(),
        username: Joi.forbidden(),
        first_name: Joi.string().min(3),
        last_name: Joi.string().min(3),
        bio: Joi.string().min(3),
        profileImage: Joi.binary(),
        coverImage: Joi.binary(),
        profile_type: Joi.string().valid('public', 'private'),
    }),
    CreateAdmin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username: Joi.string().min(3).required(),
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        admin_code: Joi.string().required(),
        bio: Joi.string().min(3),
        profileImage: Joi.binary(),
        coverImage: Joi.binary(),
    }),
    verify: Joi.object({
        otp: Joi.string().required(),
    }),
};