const express = require("express");
const tasksSchemas = require("../schemas/tasksSchemas");
const Tasks = require("../models/Tasks");
const Labels = require("../models/Labels");
const TasksLabels = require("../models/TasksLabels");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const { error } = tasksSchemas.newTask.validate(req.body);
        if (error) return res.sendStatus(422);

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
    try {
        const id = parseInt(req.params.id);
        const { name, isChecked } = req.body;

        const { error } = tasksSchemas.putTask.validate(req.body);
        if (error) return res.sendStatus(422);

        const task = await Tasks.findByPk(id);

        if(!task) return res.sendStatus(404);

        if(name !== undefined) task.name = name;
        if(isChecked !== undefined) task.isChecked = isChecked;
        
        await task.save();

        res.status(200).send(task);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
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
    try {
        const taskId = parseInt(req.params.taskId);
        const labelId = parseInt(req.params.labelId)

        const task = await Tasks.findByPk(taskId);
        const label = await Labels.findByPk(labelId);
        if(!task || !label) return res.sendStatus(404);

        const taskLabel = await TasksLabels.findByPk(labelId, taskId);

        if (taskLabel) await taskLabel.destroy();
        else await TasksLabels.createTaskLabel(labelId, taskId);

        const labelsInTask = await Labels.findLabelsByTask(taskId);

        return res.status(200).send(labelsInTask);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = router;