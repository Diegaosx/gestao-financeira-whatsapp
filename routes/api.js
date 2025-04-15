import express from "express"
import { authenticate, authorizeAdmin } from "../controllers/authController.js"
import * as authController from "../controllers/authController.js"
import * as webhookController from "../controllers/webhookController.js"
import * as dashboardController from "../controllers/dashboardController.js"
import * as contactController from "../controllers/contactController.js"
import * as categoryController from "../controllers/categoryController.js"

const router = express.Router()

// Rotas públicas
router.post("/auth/login", authController.login)
router.get("/auth/verify", authController.verifyToken)

// Webhook da Evolution API (público)
router.post("/webhook/evolution", webhookController.handleEvolutionWebhook)

// Middleware de autenticação para rotas protegidas
router.use(authenticate)

// Rotas do dashboard
router.get("/dashboard/stats", dashboardController.getStats)
router.get("/dashboard/chart/category", dashboardController.getCategoryChart)
router.get("/dashboard/chart/daily", dashboardController.getDailyChart)
router.get("/dashboard/contacts/recent", dashboardController.getRecentContacts)
router.get("/dashboard/expenses/recent", dashboardController.getRecentExpenses)

// Rotas de contatos
router.get("/contacts", contactController.listContacts)
router.get("/contacts/:id", contactController.getContact)
router.put("/contacts/:id", contactController.updateContact)
router.get("/contacts/:id/messages", contactController.getContactMessages)
router.get("/contacts/:id/expenses", contactController.getContactExpenses)
router.post("/contacts/:id/send-message", contactController.sendMessage)

// Rotas de categorias
router.get("/categories", categoryController.listCategories)
router.get("/categories/:id", categoryController.getCategory)
router.post("/categories", categoryController.createCategory)
router.put("/categories/:id", categoryController.updateCategory)
router.delete("/categories/:id", categoryController.deleteCategory)

// Rotas de administração (apenas para admin)
router.use(authorizeAdmin)

// Aqui você pode adicionar rotas específicas para administradores

export default router
