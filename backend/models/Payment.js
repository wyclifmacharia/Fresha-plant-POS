import { DataTypes } from 'sequelize'

class Payment {
    static init(sequelize) {
        return sequelize.define('Payments', {
            paymentID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            transactionID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
            },
            transactionTime: {
                type: DataTypes.STRING,
            },
            isTransactionMapped: {
                type: DataTypes.BOOLEAN,
            },
            tillNumber: {
                type: DataTypes.STRING,
            },

        })
    }
}

export default Payment
