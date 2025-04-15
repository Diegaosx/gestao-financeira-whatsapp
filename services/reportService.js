import { Expense, Category } from "../database/models/index.js"
import { Op } from "sequelize"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import fs from "fs"
import path from "path"
import os from "os"

// Gerar relatório de despesas para um período
export async function generateExpenseReport(contactId, startDate = null, endDate = null) {
  // Define datas padrão se não fornecidas
  if (!startDate) {
    startDate = new Date()
    startDate.setDate(1) // Primeiro dia do mês atual
  }

  if (!endDate) {
    endDate = new Date()
  }

  // Obtém as despesas do período
  const expenses = await Expense.findAll({
    where: {
      contactId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [Category],
    order: [["date", "DESC"]],
  })

  // Calcula o total
  const total = expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

  // Agrupa por categoria
  const categoriesMap = {}
  expenses.forEach((expense) => {
    const categoryName = expense.Category ? expense.Category.name : "Outros"
    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = {
        total: 0,
        color: expense.Category ? expense.Category.color : "#95a5a6",
      }
    }
    categoriesMap[categoryName].total += Number.parseFloat(expense.amount)
  })

  // Converte para array e calcula percentagens
  const categories = Object.entries(categoriesMap).map(([name, data]) => ({
    name,
    total: data.total,
    percentage: (data.total / total) * 100,
    color: data.color,
  }))

  // Ordena por valor (maior para menor)
  categories.sort((a, b) => b.total - a.total)

  return {
    total,
    categories,
    expenses,
    startDate,
    endDate,
    count: expenses.length,
  }
}

// Gerar relatório semanal com totais diários
export async function generateWeeklyReport(contactId, startDate = null, endDate = null) {
  // Define datas padrão se não fornecidas (últimos 7 dias)
  if (!startDate) {
    startDate = new Date()
    startDate.setDate(startDate.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)
  }

  if (!endDate) {
    endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
  }

  // Obtém as despesas do período
  const expenses = await Expense.findAll({
    where: {
      contactId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [Category],
    order: [["date", "ASC"]],
  })

  // Calcula o total
  const total = expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

  // Calcula totais diários
  const dailyTotals = []
  const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const labels = []

  for (let i = 0; i < daysCount; i++) {
    const day = new Date(startDate)
    day.setDate(day.getDate() + i)

    const dayStart = new Date(day)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(day)
    dayEnd.setHours(23, 59, 59, 999)

    const dayExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= dayStart && expenseDate <= dayEnd
    })

    const dayTotal = dayExpenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)
    dailyTotals.push(dayTotal)

    // Formata o label do dia
    const dayLabel = day.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" })
    labels.push(dayLabel)
  }

  // Calcula a tendência (comparação com a semana anterior)
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

  return {
    total,
    dailyTotals,
    labels,
    trend,
    startDate,
    endDate,
  }
}

// Gerar imagem de gráfico para relatório semanal
export async function generateWeeklyChartImage(contactId) {
  try {
    // Obter dados do relatório
    const report = await generateWeeklyReport(contactId)

    // Configurar canvas
    const width = 800
    const height = 400
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: "white" })

    // Configurar dados do gráfico
    const chartData = {
      labels: report.labels,
      datasets: [
        {
          label: "Gastos Diários (R$)",
          data: report.dailyTotals,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 1,
        },
      ],
    }

    // Configurar opções do gráfico
    const chartConfig = {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Gastos dos Últimos 7 Dias",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `R$ ${value}`,
            },
          },
        },
      },
    }

    // Gerar imagem
    const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig)

    // Salvar em arquivo temporário
    const tempDir = path.join(os.tmpdir(), "finzap-charts")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const fileName = `chart-weekly-${contactId}-${Date.now()}.png`
    const filePath = path.join(tempDir, fileName)

    fs.writeFileSync(filePath, buffer)

    return {
      filePath,
      fileName,
    }
  } catch (error) {
    console.error("Erro ao gerar imagem do gráfico:", error)
    return null
  }
}

// Gerar imagem de gráfico para relatório mensal por categoria
export async function generateMonthlyChartImage(contactId) {
  try {
    // Obter dados do relatório
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const report = await generateExpenseReport(contactId, startDate, now)

    // Configurar canvas
    const width = 800
    const height = 400
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: "white" })

    // Limitar a 5 principais categorias para melhor visualização
    const topCategories = report.categories.slice(0, 5)

    // Configurar dados do gráfico
    const chartData = {
      labels: topCategories.map((cat) => cat.name),
      datasets: [
        {
          label: "Gastos por Categoria (R$)",
          data: topCategories.map((cat) => cat.total),
          backgroundColor: topCategories.map((cat) => cat.color),
          borderWidth: 1,
        },
      ],
    }

    // Configurar opções do gráfico
    const chartConfig = {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: `Gastos por Categoria - ${now.toLocaleDateString("pt-BR", { month: "long" })}`,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                const percentage = ((value / report.total) * 100).toFixed(1)
                return `${context.label}: R$ ${value.toFixed(2)} (${percentage}%)`
              },
            },
          },
        },
      },
    }

    // Gerar imagem
    const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig)

    // Salvar em arquivo temporário
    const tempDir = path.join(os.tmpdir(), "finzap-charts")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const fileName = `chart-monthly-${contactId}-${Date.now()}.png`
    const filePath = path.join(tempDir, fileName)

    fs.writeFileSync(filePath, buffer)

    return {
      filePath,
      fileName,
    }
  } catch (error) {
    console.error("Erro ao gerar imagem do gráfico:", error)
    return null
  }
}
