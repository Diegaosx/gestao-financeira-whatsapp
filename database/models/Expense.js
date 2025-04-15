import { DataTypes } from "sequelize"
import { sequelize } from "../config.js"

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  originalMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

export default Expense
