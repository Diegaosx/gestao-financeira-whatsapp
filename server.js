import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import dotenv from "dotenv"
import { testConnection } from "./database/config.js"
import { connectRedis } from "./services/redisService.js"
import apiRoutes from "./routes/api.js"
import path from "path"
import { fileURLToPath } from "url"

// Configurar variáveis de ambiente
dotenv.config()

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Inicializar aplicação Express
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos do dashboard
app.use(express.static(path.join(__dirname, "public")))

// Rotas da API
app.use("/api", apiRoutes)

// Rota para o dashboard (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com o banco de dados
    await testConnection()

    // Conectar ao Redis
    await connectRedis()

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error)
    process.exit(1)
  }
}

startServer()
