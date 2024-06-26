import { DataTypes } from 'sequelize'

class Order {
  static init(sequelize) {
    return sequelize.define('Orders', {
      orderID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfItems: {
        type: DataTypes.INTEGER,
      },
      orderDate: {
        type: DataTypes.DATE,
      },
      orderAmount: {
        type: DataTypes.STRING,
      },

      taxAmount: {
        type: DataTypes.STRING,
      },
      kraVerificationUrl: {
        type: DataTypes.STRING,
      },
      cuRefNumber: {
        type: DataTypes.STRING,
      },
      cuInvoiceNumber: {
        type: DataTypes.STRING,
      },
      paymentRefNumber: {
        type: DataTypes.STRING,
      },
      sysproStatus: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['pending', 'processed', 'failed'],
        default: 'pending'
      },
      sysproResponse: {
        type: DataTypes.STRING,
      },
      timeProcessedToSyspro: {
        type: DataTypes.DATE,
      },
      sysproFullResponse: {
        type: DataTypes.TEXT,
      },
    })
  }
}

export default Order
