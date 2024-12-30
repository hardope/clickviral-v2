import Joi from "joi";

const postValidator = {
    create: Joi.object({
        title: Joi.string().optional(),
        content: Joi.string().required(),
        type: Joi.string().valid('comment', 'post').required(),
        parent_post_id: Joi.string().optional()
    }),
}

export {
    postValidator
}