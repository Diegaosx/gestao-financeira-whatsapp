import { DataTypes } from "sequelize"
import { sequelize } from "../config.js"

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  keywords: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: "tag",
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#3498db",
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
})

export default Category
