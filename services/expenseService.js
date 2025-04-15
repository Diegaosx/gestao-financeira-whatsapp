// Simulação de um banco de dados em memória
const expensesDB = []
const userLimitsDB = [
  {
    userId: "default",
    category: "Vestuário",
    amount: 165,
  },
  {
    userId: "default",
    category: "Alimentação",
    amount: 500,
  },
  {
    userId: "default",
    category: "Transporte",
    amount: 300,
  },
]

// Salva uma nova despesa
export async function saveExpense(expenseData) {
  const newExpense = {
    id: generateId(),
    ...expenseData,
    createdAt: new Date(),
  }

  expensesDB.push(newExpense)
  return newExpense
}

// Obtém as despesas de um usuário com filtros opcionais
export async function getUserExpenses(userId, filters = {}) {
  let userExpenses = expensesDB.filter((expense) => expense.userId === userId)

  // Aplica filtros se fornecidos
  if (filters.startDate) {
    userExpenses = userExpenses.filter((expense) => new Date(expense.date) >= new Date(filters.startDate))
  }

  if (filters.endDate) {
    userExpenses = userExpenses.filter((expense) => new Date(expense.date) <= new Date(filters.endDate))
  }

  if (filters.category) {
    userExpenses = userExpenses.filter((expense) => expense.category === filters.category)
  }

  return userExpenses
}

// Obtém os limites de gastos de um usuário
export async function getUserLimits(userId) {
  // Verifica se o usuário tem limites definidos
  const userLimits = userLimitsDB.filter((limit) => limit.userId === userId)

  // Se não tiver, retorna os limites padrão
  if (userLimits.length === 0) {
    return userLimitsDB.filter((limit) => limit.userId === "default")
  }

  return userLimits
}

// Atualiza ou cria um limite de gasto para um usuário
export async function setUserLimit(userId, category, amount) {
  // Verifica se já existe um limite para esta categoria
  const existingLimitIndex = userLimitsDB.findIndex((limit) => limit.userId === userId && limit.category === category)

  if (existingLimitIndex >= 0) {
    // Atualiza o limite existente
    userLimitsDB[existingLimitIndex].amount = amount
    return userLimitsDB[existingLimitIndex]
  } else {
    // Cria um novo limite
    const newLimit = { userId, category, amount }
    userLimitsDB.push(newLimit)
    return newLimit
  }
}

// Gera um ID único
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
