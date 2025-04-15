import { categorizeExpense } from "./categorizer.js"
import { generateExpenseReport, generateWeeklyReport } from "../services/reportService.js"

// Processa a mensagem do usuário e identifica a intenção
export async function processMessage(message) {
  // Limpa a mensagem
  const cleanMessage = message.trim().toLowerCase()

  // Verifica se é uma consulta
  if (isQuery(cleanMessage)) {
    return {
      type: "query",
      query: extractQuery(cleanMessage),
    }
  }

  // Tenta extrair uma despesa
  const expenseData = extractExpense(cleanMessage)
  if (expenseData) {
    return {
      type: "expense",
      ...expenseData,
    }
  }

  // Se não conseguiu identificar, retorna desconhecido
  return {
    type: "unknown",
    originalMessage: message,
  }
}

// Verifica se a mensagem é uma consulta
function isQuery(message) {
  const queryKeywords = [
    "quanto",
    "gastei",
    "gasto",
    "gastos",
    "despesas",
    "relatório",
    "relatorio",
    "resumo",
    "balanço",
    "balanco",
    "últimos dias",
    "ultimos dias",
    "esta semana",
    "esse mês",
    "esse mes",
  ]

  return queryKeywords.some((keyword) => message.includes(keyword))
}

// Extrai o tipo de consulta da mensagem
function extractQuery(message) {
  if (message.includes("últimos dias") || message.includes("ultimos dias")) {
    return "last_days"
  }

  if (message.includes("esta semana") || message.includes("essa semana")) {
    return "this_week"
  }

  if (message.includes("esse mês") || message.includes("esse mes") || message.includes("este mês")) {
    return "this_month"
  }

  // Padrão para consultas não específicas
  return "general"
}

// Extrai informações de despesa da mensagem
function extractExpense(message) {
  // Regex para encontrar valores monetários
  const amountRegex = /\b\d+(?:[.,]\d+)?\b/
  const amountMatch = message.match(amountRegex)

  if (!amountMatch) return null

  // Extrai o valor e converte para número
  const amountStr = amountMatch[0].replace(",", ".")
  const amount = Number.parseFloat(amountStr)

  if (isNaN(amount)) return null

  // Remove o valor da mensagem para extrair a descrição
  const descriptionPart = message.replace(amountRegex, "").trim()

  // Categoriza a despesa com base na descrição
  const { category, description } = categorizeExpense(descriptionPart)

  return {
    amount,
    category,
    description: description || descriptionPart,
    date: new Date(),
  }
}

// Processa consultas do usuário
export async function handleUserQuery(userId, queryType) {
  switch (queryType) {
    case "last_days":
      return await generateLastDaysReport(userId)
    case "this_week":
      return await generateWeeklyReport(userId)
    case "this_month":
      return await generateMonthlyReport(userId)
    default:
      return await generateExpenseReport(userId)
  }
}

// Gera relatório dos últimos dias
async function generateLastDaysReport(userId) {
  const days = 7 // Últimos 7 dias
  const now = new Date()
  const startDate = new Date()
  startDate.setDate(now.getDate() - days + 1)
  startDate.setHours(0, 0, 0, 0)

  const report = await generateWeeklyReport(userId, startDate, now)

  // Formata a resposta
  const startDateFormatted = startDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  const endDateFormatted = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  const currentTime = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  let response = `✅\nÚltimos ${days} dias\nR$ ${report.total.toFixed(2)} - ${startDateFormatted} á ${endDateFormatted}\n`

  // Adiciona os dias da semana
  const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]
  response += weekdays.slice(0, days).join("\n") + "\n"

  // Adiciona os valores por dia
  response += report.dailyTotals.map((total) => total.toFixed(0)).join("\n") + "\n"

  response += `${currentTime}\n`

  // Adiciona informação sobre tendência
  if (report.trend > 0) {
    response += `Seus gastos aumentaram em ${Math.abs(report.trend)}% essa semana\n`
  } else if (report.trend < 0) {
    response += `Seus gastos diminuíram em ${Math.abs(report.trend)}% essa semana\n`
  } else {
    response += `Seus gastos se mantiveram estáveis essa semana\n`
  }

  response += `Segue gráfico dos seus gastos dos últimos ${days} dias 👆`

  return response
}

// Gera relatório mensal
async function generateMonthlyReport(userId) {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)

  const report = await generateExpenseReport(userId, startDate, now)

  // Formata a resposta
  const monthName = now.toLocaleDateString("pt-BR", { month: "long" })

  let response = `📊 Relatório de ${monthName}\n\n`
  response += `Total gasto: R$ ${report.total.toFixed(2)}\n\n`
  response += `Principais categorias:\n`

  // Adiciona as categorias
  report.categories.forEach((category) => {
    response += `- ${category.name}: R$ ${category.total.toFixed(2)} (${category.percentage.toFixed(0)}%)\n`
  })

  return response
}
