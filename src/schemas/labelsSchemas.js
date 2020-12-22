const Joi = require("joi");

const newLabel = Joi.object({
    color: Joi.string().required().trim().pattern(/^#\w{6}$/)
})

module.exports = {
    newLabel
};