const Joi = require("joi");

const newTask = Joi.object({
    name: Joi.string().required().trim()
});

const putTask = Joi.object({
    name: Joi.string().trim(),
    isChecked: Joi.boolean()
});

module.exports = {
    newTask,
    putTask
};