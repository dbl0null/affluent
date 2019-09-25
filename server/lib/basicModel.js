const db = require('./db');

function basicQueries (table) {
  return {
    select: `SELECT * from ${table}`,
    insert: `INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`,
    update: `UPDATE ${table} SET ? WHERE id=?`,
    delete: `DELETE FROM ${table} WHERE id=?`,
    count:  `SELECT COUNT(*) from ${table}`,
  }
}

class BasicModel {
  constructor (table) {
    this.queries = basicQueries(table)
  }
  async getAll () {
    return (await db.query(this.queries.select))[0]
  }
  async get (id) {
    return (await db.query(`${this.queries.select} WHERE id=?`,[Number(id)]))[0][0]
  }
  async create (fields) {
    return await db.query(this.queries.insert,[fields, fields])
  }
  async createMany (data) {
    return data.reduce((p, row) => {
      return p.then(async () => await this.create(row))
    }, Promise.resolve())
  }
  async update (id, fields) {
    await db.query(this.queries.update,[fields, Number(id)])
    return this.get(id);
  }
  async delete (id) {
    const result = await db.query(this.queries.delete,[Number(id)])
    return result.affectedRows;
  }
}

module.exports = BasicModel
