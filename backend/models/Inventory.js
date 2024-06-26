import { DataTypes } from 'sequelize'

class Inventory {
  static init(sequelize) {
    return sequelize.define('Inventory', {
     inventoryID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      inStockQuantity: {
        type: DataTypes.STRING,
      },
      remainingStock: {
        type: DataTypes.STRING,
      },
      taxRate: {
        type: DataTypes.STRING,
      },
      taxClass: {
        type: DataTypes.STRING,
      },
      unitOfMeasure: {
        type: DataTypes.STRING,
      }
    })
  }
}

export default Inventory
