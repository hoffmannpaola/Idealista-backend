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

    static async selectAllItems() {
        const allLabels = await super.selectAllItems();
        return allLabels.rows;
    }
}

module.exports = Labels;