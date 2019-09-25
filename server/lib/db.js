const config = require('../../config')
const { createPool } = require('mysql2/promise')

const poolConfig = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
  timezone: '+00:00',
  debug: config.db.debug
}

const pool = createPool(poolConfig)

module.exports = pool
