const db = require("../database");

class Labels {
    constructor(id, color) {
        this.id = id;
        this.color = color;
       
    }

    static async createLabel(color) {

        const results = await db.query(`INSERT INTO labels (color) VALUES ($1) RETURNING *`, [color]);

        const label = results.rows[0];

        return new Labels (label.id, label.color);

    }
   
}

module.exports = Labels;