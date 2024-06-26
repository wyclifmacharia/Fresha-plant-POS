import { DataTypes } from 'sequelize'

class Shop {
    static init(sequelize) {
        return sequelize.define('Shops', {
            shopID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            location: {
                type: DataTypes.STRING,
            },
            tillNumber: {
                type: DataTypes.STRING,
            },
            bank: {
                type: DataTypes.STRING,
            },


        })
    }
}

export default Shop
