const Joi = require("joi");

const newTask = Joi.object({
    name: Joi.string().required().trim()
})

module.exports = {
    newTask
};