import { DataTypes } from "sequelize";

class User {
  static init(sequelize) {
    return sequelize.define("Users", {
      userID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email",
      },
      password: {
        type: DataTypes.STRING,
      },
      session: {
        type: DataTypes.STRING,
      },
      expiry: {
        type: DataTypes.DATE,
      },
      sysproUser: {
        type: DataTypes.STRING,
      },
      sysproPassword: {
        type: DataTypes.STRING,
      },
    });
  }
}

export default User;
