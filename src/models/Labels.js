const db = require("../database");
const BaseModel = require('./BaseModel');

class Labels extends BaseModel {
    static tableName = 'labels';

    constructor(id, color) {
        super(id);
        this.color = color;
    }

    static async createLabel(color) {
        const results = await db.query(`INSERT INTO labels (color) VALUES ($1) RETURNING *`, [color]);

        const label = results.rows[0];

        return new Labels (label.id, label.color);
    }

    static async findAll() {
        const allLabels = await super.findAll();
        return allLabels.rows.map(label => new Labels(label.id, label.color));
    }

    static async findLabelsByTask(taskId) {
        const query = 'SELECT l.id, l.color FROM labels AS l JOIN "tasksLabels" AS tl ON l.id = tl."labelId" WHERE tl."taskId" = $1';
        const labels = await db.query(query, [taskId]);

        return labels.rows.map(label => new Labels(label.id, label.color));
    }

    static async findByPk(id) {
        const result = await super.findByPk(id);
        const label = result.rows[0];

        if (!label) return undefined;
        return new Labels(label.id, label.color);
    }
}

module.exports = Labels;