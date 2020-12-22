const db = require('../database');

class BaseModel {
    static tableName = '';

    constructor(id) {
        this.id = id;
    }

    static selectAllItems() {
        return db.query(`SELECT * FROM ${this.tableName}`);
    }

}

module.exports = BaseModel;