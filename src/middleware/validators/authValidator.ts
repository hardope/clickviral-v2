import Joi from 'joi';

export const authValidator = {

    security: Joi.object({
        two_factor_auth: Joi.boolean(),
        login_notifications: Joi.boolean(),
    }),

    twoFactorLogin : Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required()
    }),
};
