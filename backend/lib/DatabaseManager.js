import { Sequelize } from 'sequelize'

import Order from '../models/Order.js'
import OrderItem from '../models/OrderItem.js'
import Inventory from '../models/Inventory.js'
import Shop from '../models/Shop.js'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
export var db = null

class DatabaseManager {
  sequelize = null

  order = null
  orderItem = null
  inventory = null
  shop = null
  payment = null
  user = null


  static connect(callback) {
    try {
      var timezone = 'Africa/Nairobi'
      this.sequelize = new Sequelize(
        process.env['DATABASE_NAME'],
        process.env['DATABASE_USER'],
        process.env['DATABASE_PASSWORD'], {
        dialect: process.env['DATABASE_DIALECT'],
        logging: false,
      });

      this.sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.')
          this.initModels(function (res) {
            return callback()
          })
        })
        .catch((error) => {
          console.error('Unable to connect to the database: ', error)
          return callback(error, this.sequelize)
        })
    } catch (e) {
      console.log(e)
      return callback(e, null)
    }
  }
  static initModels(callback) {
    this.order = Order.init(this.sequelize)
    this.orderItem = OrderItem.init(this.sequelize)
    this.inventory = Inventory.init(this.sequelize)
    this.payment = Payment.init(this.sequelize)
    this.shop = Shop.init(this.sequelize)
    this.user = User.init(this.sequelize)
    this.createRelationships()

    this.sequelize
      .sync({ alter: false })
      .then(() => {
        console.log('Tables created!')
        return callback(1)
      })
      .catch((error) => {
        console.error('Unable to create table : ', error)
        return callback(0)
      })
  }
  static createRelationships() {
    this.order.hasMany(this.orderItem, {
      as: 'items',
      foreignKey: { name: 'orderID', allowNull: false },
      onDelete: 'CASCADE',
    })

    this.orderItem.belongsTo(this.order, {
      as: 'order',
      foreignKey: { name: 'orderID', allowNull: false },
      onDelete: 'CASCADE',
    })

    this.shop.hasMany(this.user, {
      as: 'users',
      foreignKey: { name: 'shopID', allowNull: false },
      onDelete: 'CASCADE',
    })
    this.user.belongsTo(this.shop, {
      as: 'shop',
      foreignKey: { name: 'shopID', allowNull: false },
      onDelete: 'CASCADE',
    })

    this.inventory.hasMany(this.orderItem, {
      as: 'orderItems',
      foreignKey: { name: 'inventoryID', allowNull: false },
      onDelete: 'CASCADE',
    })
    this.orderItem.belongsTo(this.inventory, {
      as: 'inventory',
      foreignKey: { name: 'inventoryID', allowNull: false },
      onDelete: 'CASCADE',
    })

  }
}

export default DatabaseManager
