const db = require('../database');

class BaseModel {
    static tableName = '';
    tableName = '';

    constructor(id) {
        this.id = id;
    }

    static findAll() {
        return db.query(`SELECT * FROM ${this.tableName}`);
    }

    static findByPk(id) {
        return db.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    }

    destroy() {
        return db.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [this.id]);
    }
}

module.exports = BaseModel;