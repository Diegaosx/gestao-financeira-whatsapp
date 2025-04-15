import { DataTypes } from "sequelize"
import { sequelize } from "../config.js"

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  direction: {
    type: DataTypes.ENUM("incoming", "outgoing"),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  messageType: {
    type: DataTypes.ENUM("text", "image", "expense", "report", "other"),
    defaultValue: "text",
  },
})

export default Message
