const express = require("express");
const tasksSchemas = require("../schemas/tasksSchemas");
const Tasks = require("../models/Tasks");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { name } = req.body;
        const { error } = tasksSchemas.newTask.validate(req.body);
        if (error) return res.status(422).send({error: error.details[0].message});

        const task = await Tasks.createTask(name);

        res.status(201).send(task);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }

});

router.get("/", async (req, res) => {
    
});

router.put("/:id", async (req, res) => {
    
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const task = await Tasks.findByPk(id);
        if (!task) return res.sendStatus(404);

        await task.destroy();
        return res.sendStatus(200);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post("/:taskId/labels/:labelId", async (req, res) => {

});



module.exports = router;