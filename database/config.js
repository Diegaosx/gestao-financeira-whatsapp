import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

// Testar conexão
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log("Conexão com o banco de dados estabelecida com sucesso.")
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error)
  }
}

export { sequelize, testConnection }
