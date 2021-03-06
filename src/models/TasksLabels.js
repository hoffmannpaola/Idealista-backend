const db = require("../database");
const BaseModel = require('./BaseModel');

class TasksLabels extends BaseModel {
    static tableName = `"tasksLabels"`;

    constructor(id, taskId, labelId) {
        super(id);
        this.taskId = taskId;
        this.labelId = labelId;
    }

    static async createTaskLabel(labelId, taskId) {
        const query = `INSERT INTO "tasksLabels" ("labelId", "taskId") VALUES ($1, $2)`;
        await db.query(query, [labelId, taskId]);
    }

    static async findByLabelAndTask(labelId, taskId) {
        const query = `SELECT * FROM "tasksLabels" WHERE "labelId" = $1 AND "taskId" = $2`;
        const result = await db.query(query, [labelId, taskId]);
        const taskLabel = result.rows[0];

        if (!taskLabel) return undefined;
        return new TasksLabels(taskLabel.id, taskLabel.taskId, taskLabel.labelId);
    }

    static async findByPk(taskId) {
        const result = await db.query(`SELECT * FROM "tasksLabels" WHERE "taskId" = $1`, [taskId]);
        const tasksLabels = result.rows;

        if (!tasksLabels[0]) return undefined;

        return tasksLabels.map(tL => new TasksLabels(tL.id, tL.taskId, tL.labelId));
    }
}

module.exports = TasksLabels;