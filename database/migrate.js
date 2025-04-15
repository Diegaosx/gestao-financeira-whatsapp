import { sequelize } from "./config.js"
import dotenv from "dotenv"

dotenv.config()

async function migrate() {
  try {
    // Sincronizar todos os modelos com o banco de dados
    await sequelize.sync({ alter: true })
    console.log("Migração concluída com sucesso!")
    process.exit(0)
  } catch (error) {
    console.error("Erro durante a migração:", error)
    process.exit(1)
  }
}

migrate()
