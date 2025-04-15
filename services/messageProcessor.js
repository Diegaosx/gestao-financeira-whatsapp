import { Category, Expense, Contact } from "../database/models/index.js"
import { Op } from "sequelize"
import { getCache, setCache } from "./redisService.js"
import { generateExpenseReport, generateWeeklyReport } from "./reportService.js"

// Processar mensagem recebida
export async function processMessage(message, sender) {
  // Limpar a mensagem
  const cleanMessage = message.trim().toLowerCase()

  // Verificar se é uma consulta
  if (isQuery(cleanMessage)) {
    return {
      type: "query",
      query: extractQuery(cleanMessage),
    }
  }

  // Tentar extrair uma despesa
  const expenseData = await extractExpense(cleanMessage)
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

// Verificar se a mensagem é uma consulta
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
    "categoria",
    "categorias",
    "ajuda",
    "help",
  ]

  return queryKeywords.some((keyword) => message.includes(keyword))
}

// Extrair o tipo de consulta da mensagem
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

  if (message.includes("categoria") || message.includes("categorias")) {
    return "categories"
  }

  if (message.includes("ajuda") || message.includes("help")) {
    return "help"
  }

  // Padrão para consultas não específicas
  return "general"
}

// Extrair informações de despesa da mensagem
async function extractExpense(message) {
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
  const { category, description } = await categorizeExpense(descriptionPart)

  return {
    amount,
    categoryId: category.id,
    categoryName: category.name,
    description: description || descriptionPart,
    date: new Date(),
    originalMessage: message,
  }
}

// Categorizar despesa com base na descrição
async function categorizeExpense(description) {
  const lowerDescription = description.toLowerCase()

  // Tentar obter categorias do cache
  let categories
  const cachedCategories = await getCache("categories")

  if (cachedCategories) {
    categories = JSON.parse(cachedCategories)
  } else {
    // Se não estiver em cache, buscar do banco de dados
    categories = await Category.findAll()
    // Salvar no cache por 1 hora
    await setCache("categories", JSON.stringify(categories), 3600)
  }

  // Verificar cada categoria
  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerDescription.includes(keyword)) {
        return {
          category,
          description: cleanupDescription(lowerDescription, keyword),
        }
      }
    }
  }

  // Se não encontrou nenhuma categoria, criar uma nova baseada na descrição
  const newCategoryName = generateCategoryName(lowerDescription)
  const [newCategory] = await Category.findOrCreate({
    where: { name: newCategoryName },
    defaults: {
      name: newCategoryName,
      keywords: [lowerDescription],
      icon: "tag",
      color: getRandomColor(),
    },
  })

  // Limpar o cache de categorias
  await setCache("categories", JSON.stringify(await Category.findAll()), 3600)

  return {
    category: newCategory,
    description: cleanupDescription(lowerDescription),
  }
}

// Gerar nome de categoria baseado na descrição
function generateCategoryName(description) {
  // Lista de possíveis categorias baseadas em palavras comuns
  const categoryMappings = {
    gasolina: "Transporte",
    combustível: "Transporte",
    combustivel: "Transporte",
    uber: "Transporte",
    taxi: "Transporte",
    ônibus: "Transporte",
    onibus: "Transporte",
    metrô: "Transporte",
    metro: "Transporte",
    passagem: "Transporte",
    diesel: "Transporte",
    óleo: "Transporte",
    oleo: "Transporte",

    mercado: "Alimentação",
    supermercado: "Alimentação",
    restaurante: "Alimentação",
    lanche: "Alimentação",
    comida: "Alimentação",
    almoço: "Alimentação",
    jantar: "Alimentação",
    café: "Alimentação",
    cafe: "Alimentação",
    padaria: "Alimentação",

    roupa: "Vestuário",
    camisa: "Vestuário",
    calça: "Vestuário",
    calca: "Vestuário",
    sapato: "Vestuário",
    tênis: "Vestuário",
    tenis: "Vestuário",

    cinema: "Lazer",
    teatro: "Lazer",
    show: "Lazer",
    jogo: "Lazer",
    viagem: "Lazer",
    passeio: "Lazer",

    remédio: "Saúde",
    remedio: "Saúde",
    médico: "Saúde",
    medico: "Saúde",
    consulta: "Saúde",
    exame: "Saúde",
    farmácia: "Saúde",
    farmacia: "Saúde",

    escola: "Educação",
    faculdade: "Educação",
    curso: "Educação",
    livro: "Educação",
    material: "Educação",

    aluguel: "Moradia",
    condomínio: "Moradia",
    condominio: "Moradia",
    casa: "Moradia",
    apartamento: "Moradia",
    reforma: "Moradia",

    luz: "Contas",
    água: "Contas",
    agua: "Contas",
    gás: "Contas",
    gas: "Contas",
    internet: "Contas",
    telefone: "Contas",
    celular: "Contas",
  }

  // Verificar se alguma palavra da descrição corresponde a uma categoria conhecida
  for (const [keyword, category] of Object.entries(categoryMappings)) {
    if (description.includes(keyword)) {
      return category
    }
  }

  // Se não encontrou correspondência, usar a primeira palavra como nome da categoria
  const words = description.split(" ").filter((word) => word.length > 3)
  if (words.length > 0) {
    // Capitalizar a primeira letra
    const categoryName = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return categoryName
  }

  // Se tudo falhar, retornar "Outros"
  return "Outros"
}

// Limpar a descrição para exibição
function cleanupDescription(description, matchedKeyword = null) {
  // Capitaliza a primeira letra de cada palavra
  let cleanDescription = description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Se encontrou uma palavra-chave, tenta usá-la como descrição principal
  if (matchedKeyword) {
    const keywordIndex = description.indexOf(matchedKeyword)
    if (keywordIndex >= 0) {
      // Extrai a parte da descrição que contém a palavra-chave e um pouco antes
      const startIndex = Math.max(0, keywordIndex - 10)
      const relevantPart = description.substring(startIndex)

      // Capitaliza a primeira letra
      cleanDescription = relevantPart.charAt(0).toUpperCase() + relevantPart.slice(1)
    }
  }

  return cleanDescription.trim()
}

// Gerar uma cor aleatória para novas categorias
function getRandomColor() {
  const colors = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#34495e",
    "#7f8c8d",
    "#d35400",
    "#c0392b",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#f1c40f",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Processar consultas do usuário
export async function handleUserQuery(sender, queryType) {
  // Obter ou criar contato
  const [contact] = await Contact.findOrCreate({
    where: { phoneNumber: sender },
    defaults: {
      phoneNumber: sender,
      name: `Usuário ${sender.substring(sender.length - 4)}`,
    },
  })

  switch (queryType) {
    case "last_days":
      return await generateLastDaysReport(contact.id)
    case "this_week":
      return await generateWeeklyReport(contact.id)
    case "this_month":
      return await generateMonthlyReport(contact.id)
    case "categories":
      return await generateCategoriesReport(contact.id)
    case "help":
      return generateHelpMessage()
    default:
      return await generateExpenseReport(contact.id)
  }
}

// Gerar relatório dos últimos dias
async function generateLastDaysReport(contactId) {
  const days = 7 // Últimos 7 dias
  const now = new Date()
  const startDate = new Date()
  startDate.setDate(now.getDate() - days + 1)
  startDate.setHours(0, 0, 0, 0)

  const expenses = await Expense.findAll({
    where: {
      contactId,
      date: {
        [Op.between]: [startDate, now],
      },
    },
    include: [Category],
    order: [["date", "ASC"]],
  })

  // Calcular totais diários
  const dailyTotals = {}
  const daysOfWeek = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

  // Inicializar todos os dias com zero
  for (let i = 0; i < days; i++) {
    const day = new Date(startDate)
    day.setDate(day.getDate() + i)
    const dateKey = day.toISOString().split("T")[0]
    dailyTotals[dateKey] = 0
  }

  // Somar despesas por dia
  expenses.forEach((expense) => {
    const dateKey = expense.date.toISOString().split("T")[0]
    if (dailyTotals[dateKey] !== undefined) {
      dailyTotals[dateKey] += Number.parseFloat(expense.amount)
    }
  })

  // Calcular total geral
  const total = Object.values(dailyTotals).reduce((sum, value) => sum + value, 0)

  // Calcular tendência (comparação com a semana anterior)
  const previousWeekStart = new Date(startDate)
  previousWeekStart.setDate(previousWeekStart.getDate() - 7)

  const previousWeekEnd = new Date(startDate)
  previousWeekEnd.setDate(previousWeekEnd.getDate() - 1)
  previousWeekEnd.setHours(23, 59, 59, 999)

  const previousWeekExpenses = await Expense.findAll({
    where: {
      contactId,
      date: {
        [Op.between]: [previousWeekStart, previousWeekEnd],
      },
    },
  })

  const previousWeekTotal = previousWeekExpenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

  let trend = 0
  if (previousWeekTotal > 0) {
    trend = Math.round(((total - previousWeekTotal) / previousWeekTotal) * 100)
  }

  // Formatar a resposta
  const startDateFormatted = startDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  const endDateFormatted = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  const currentTime = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  let response = `✅\nÚltimos ${days} dias\nR$ ${total.toFixed(2)} - ${startDateFormatted} á ${endDateFormatted}\n`

  // Adicionar dias da semana
  const dayLabels = []
  const dayValues = []

  for (let i = 0; i < days; i++) {
    const day = new Date(startDate)
    day.setDate(day.getDate() + i)
    const dateKey = day.toISOString().split("T")[0]
    const dayOfWeek = daysOfWeek[day.getDay()]

    dayLabels.push(dayOfWeek)
    dayValues.push(dailyTotals[dateKey].toFixed(0))
  }

  response += dayLabels.join("\n") + "\n"
  response += dayValues.join("\n") + "\n"

  response += `${currentTime}\n`

  // Adicionar informação sobre tendência
  if (trend > 0) {
    response += `Seus gastos aumentaram em ${Math.abs(trend)}% essa semana\n`
  } else if (trend < 0) {
    response += `Seus gastos diminuíram em ${Math.abs(trend)}% essa semana\n`
  } else {
    response += `Seus gastos se mantiveram estáveis essa semana\n`
  }

  response += `Segue gráfico dos seus gastos dos últimos ${days} dias 👆`

  return response
}

// Gerar relatório mensal
async function generateMonthlyReport(contactId) {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)

  const expenses = await Expense.findAll({
    where: {
      contactId,
      date: {
        [Op.between]: [startDate, now],
      },
    },
    include: [Category],
  })

  // Calcular total
  const total = expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

  // Agrupar por categoria
  const categoriesMap = {}
  expenses.forEach((expense) => {
    const categoryName = expense.Category ? expense.Category.name : "Outros"
    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = 0
    }
    categoriesMap[categoryName] += Number.parseFloat(expense.amount)
  })

  // Converter para array e calcular percentagens
  const categories = Object.entries(categoriesMap).map(([name, categoryTotal]) => ({
    name,
    total: categoryTotal,
    percentage: (categoryTotal / total) * 100,
  }))

  // Ordenar por valor (maior para menor)
  categories.sort((a, b) => b.total - a.total)

  // Formatar a resposta
  const monthName = now.toLocaleDateString("pt-BR", { month: "long" })

  let response = `📊 Relatório de ${monthName}\n\n`
  response += `Total gasto: R$ ${total.toFixed(2)}\n\n`
  response += `Principais categorias:\n`

  // Adicionar as categorias
  categories.forEach((category) => {
    response += `- ${category.name}: R$ ${category.total.toFixed(2)} (${category.percentage.toFixed(0)}%)\n`
  })

  return response
}

// Gerar relatório de categorias
async function generateCategoriesReport(contactId) {
  const categories = await Category.findAll({
    order: [["name", "ASC"]],
  })

  let response = `📋 Categorias disponíveis:\n\n`

  categories.forEach((category) => {
    response += `- ${category.name}\n`
  })

  response += `\nPara registrar um gasto, envie o valor e a descrição. Exemplo: "camisa 110"`

  return response
}

// Gerar mensagem de ajuda
function generateHelpMessage() {
  return (
    `🤖 *FinZap - Assistente Financeiro*\n\n` +
    `Comandos disponíveis:\n\n` +
    `📝 *Registrar gasto:*\n` +
    `Envie o item e valor. Ex: "camisa 110"\n\n` +
    `📊 *Relatórios:*\n` +
    `- "quanto gastei nos últimos dias?"\n` +
    `- "quanto gastei esse mês?"\n` +
    `- "quanto gastei essa semana?"\n\n` +
    `📋 *Categorias:*\n` +
    `- "mostrar categorias"\n\n` +
    `❓ *Ajuda:*\n` +
    `- "ajuda" ou "help"`
  )
}
