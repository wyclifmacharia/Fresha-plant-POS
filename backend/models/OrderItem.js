import { DataTypes } from 'sequelize'

class OrderItem {
  static init(sequelize) {
    return sequelize.define('OrderItems', {
     
      itemSKU: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.STRING,
      },
      unitOfMeasure: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },
      tax: {
        type: DataTypes.STRING,
      },
      itemCost: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    })
  }
}

export default OrderItem
