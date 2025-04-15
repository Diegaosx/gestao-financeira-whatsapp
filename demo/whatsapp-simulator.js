import readline from "readline"
import { processMessage, handleUserQuery } from "../bot/messageProcessor.js"
import { saveExpense, getUserExpenses, getUserLimits } from "../services/expenseService.js"
import { formatDate } from "../utils/formatters.js"

// Simulador de interação com o WhatsApp
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const userId = "user123" // ID de usuário simulado

console.log("=== Simulador do FinZap WhatsApp Bot ===")
console.log("Digite suas mensagens como se estivesse no WhatsApp")
console.log('Digite "sair" para encerrar')
console.log("---------------------------------------")

// Função para processar a entrada do usuário
async function processUserInput(input) {
  if (input.toLowerCase() === "sair") {
    console.log("Encerrando simulador...")
    rl.close()
    return
  }

  try {
    // Processa a mensagem
    const processedMessage = await processMessage(input)

    if (processedMessage.type === "expense") {
      // Salva a despesa
      const savedExpense = await saveExpense({
        userId,
        amount: processedMessage.amount,
        category: processedMessage.category,
        description: processedMessage.description,
        date: processedMessage.date,
      })

      // Verifica limites
      const userLimits = await getUserLimits(userId)
      const categoryLimit = userLimits.find((limit) => limit.category === savedExpense.category)

      let limitWarning = ""
      if (categoryLimit) {
        const expenses = await getUserExpenses(userId, {
          category: savedExpense.category,
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
        const percentageUsed = (totalSpent / categoryLimit.amount) * 100

        if (percentageUsed > 80) {
          limitWarning = `\nLembrete: Você está quase chegando no seu limite definido de R$ ${categoryLimit.amount.toFixed(0)} por mês com ${savedExpense.category}.`
        }
      }

      // Formata a resposta
      const formattedDate = formatDate(savedExpense.date)
      const currentTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

      console.log("\n🤖 FinZap:")
      console.log(
        `Gasto adicionado\n📌 ${savedExpense.description.toUpperCase()} (${savedExpense.category})\nR$ ${savedExpense.amount.toFixed(2)}\n\n${formattedDate}\n\n${currentTime}${limitWarning}`,
      )
    } else if (processedMessage.type === "query") {
      // Processa consultas
      const response = await handleUserQuery(userId, processedMessage.query)
      console.log("\n🤖 FinZap:")
      console.log(response)
    } else {
      console.log("\n🤖 FinZap:")
      console.log(
        "Desculpe, não entendi. Tente enviar um gasto como 'camisa 110' ou uma pergunta como 'quanto gastei nos últimos dias?'",
      )
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error)
    console.log("\n🤖 FinZap:")
    console.log("Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.")
  }

  // Continua o loop
  promptUser()
}

// Função para solicitar entrada do usuário
function promptUser() {
  rl.question("\n💬 Você: ", processUserInput)
}

// Inicia o simulador
promptUser()

// Adiciona alguns dados de exemplo para demonstração
async function seedDemoData() {
  const today = new Date()

  // Adiciona gastos dos últimos 7 dias
  const expenses = [
    {
      amount: 155,
      description: "Restaurante",
      category: "Alimentação",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    },
    {
      amount: 105,
      description: "Uber",
      category: "Transporte",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    },
    {
      amount: 105,
      description: "Uber",
      category: "Transporte",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
    },
    {
      amount: 53,
      description: "Farmácia",
      category: "Saúde",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
    },
    {
      amount: 64,
      description: "Cinema",
      category: "Lazer",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    },
    {
      amount: 131,
      description: "Mercado",
      category: "Alimentação",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    },
    {
      amount: 52,
      description: "Livro",
      category: "Educação",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    },
    { amount: 72, description: "Padaria", category: "Alimentação", date: new Date() },
  ]

  for (const expense of expenses) {
    await saveExpense({
      userId,
      ...expense,
    })
  }
}

// Executa o seed de dados
seedDemoData()
