const db = require("../database");
const BaseModel = require('./BaseModel');
const Labels = require('./Labels');

class Tasks extends BaseModel {
    static tableName = 'tasks';
    tableName = 'tasks';

    constructor(id, name, isChecked, labels) {
        super(id);
        this.name = name;
        this.isChecked = isChecked;
        this.labels = labels;
    }

    static async createTask(name) {
        const query = `INSERT INTO tasks (name) VALUES ($1) RETURNING *`;
        const results = await db.query(query, [name]);

        const task = results.rows[0];

        return new Tasks(task.id, task.name, task.isChecked, []);
    }

    static async findByPk(id) {
        const result = await super.findByPk(id);
        const task = result.rows[0];

        if (!task) return undefined;

        const labels = await Labels.findLabelsByTask(id);
        return new Tasks(task.id, task.name, task.isChecked, labels);
    }

    static async findAll() {
        const result = await super.findAll()
        
        const tasks = result.rows;
        const allTasksPromise = tasks.map(async task => {
            const labels = await Labels.findLabelsByTask(task.id);
            return new Tasks(task.id, task.name, task.isChecked, labels);
        });

        return await Promise.all(allTasksPromise);
    }

    async save() {
        const query = `UPDATE tasks SET name = $1, "isChecked" = $2 WHERE id = $3`;
        await db.query(query, [this.name, this.isChecked, this.id]);
    }
}

module.exports = Tasks;