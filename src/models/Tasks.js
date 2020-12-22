const db = require("../database");

class Tasks {

    constructor(id, name, isChecked, labels) {
        this.id = id;
        this.name = name;
        this.isChecked = isChecked;
        this.labels = labels;
    }

    static async createTask(name) {

        const results = await db.query(`INSERT INTO tasks (name) VALUES ($1) RETURNING *`, [name]);

        const task = results.rows[0];

        return new Tasks (task.id, task.name, task.isChecked, []);

    }
}



module.exports = Tasks;