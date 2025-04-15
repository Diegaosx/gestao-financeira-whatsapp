import { DataTypes } from "sequelize"
import { sequelize } from "../config.js"

const Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastInteraction: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  monthlyBudget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
})

export default Contact
