const db = require('../config/db')
const Sequelize = require('sequelize')

const {
  DataTypes
} = Sequelize

/** Users Table */
const Users = db.define('users', {
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.STRING,
  },
  
})

const Data = db.define('data', {
  Nama_data: {
    type: DataTypes.STRING,
  },
  Jumlah: {
    type: DataTypes.STRING,
  },
})

module.exports = {
  Users,
  Data,
}