import Joi from 'joi';

export const authValidator = {

    security: Joi.object({
        two_factor_auth: Joi.boolean(),
        login_notifications: Joi.boolean(),
    }),
};
