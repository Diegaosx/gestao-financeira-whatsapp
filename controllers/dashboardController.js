import { Contact, Expense, Category } from "../database/models/index.js"
import { Op, Sequelize } from "sequelize"

// Obter estatísticas gerais
export async function getStats(req, res) {
  try {
    // Total de contatos
    const totalContacts = await Contact.count()

    // Total de despesas
    const totalExpenses = await Expense.count()

    // Valor total de despesas
    const totalAmount = await Expense.sum("amount")

    // Contatos ativos nos últimos 7 dias
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activeContacts = await Contact.count({
      where: {
        lastInteraction: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    })

    // Despesas nos últimos 7 dias
    const recentExpenses = await Expense.count({
      where: {
        date: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    })

    // Média de gastos por contato
    const avgExpensePerContact = totalContacts > 0 ? totalAmount / totalContacts : 0

    return res.status(200).json({
      success: true,
      stats: {
        totalContacts,
        totalExpenses,
        totalAmount: Number.parseFloat(totalAmount || 0),
        activeContacts,
        recentExpenses,
        avgExpensePerContact: Number.parseFloat(avgExpensePerContact || 0),
      },
    })
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter dados para gráfico de gastos por categoria
export async function getCategoryChart(req, res) {
  try {
    const result = await Expense.findAll({
      attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
      include: [
        {
          model: Category,
          attributes: ["name", "color"],
        },
      ],
      group: ["Category.id", "Category.name", "Category.color"],
      order: [[Sequelize.fn("SUM", Sequelize.col("amount")), "DESC"]],
    })

    const chartData = result.map((item) => ({
      category: item.Category.name,
      total: Number.parseFloat(item.dataValues.total),
      color: item.Category.color,
    }))

    return res.status(200).json({
      success: true,
      chartData,
    })
  } catch (error) {
    console.error("Erro ao obter dados do gráfico de categorias:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter dados para gráfico de gastos por dia
export async function getDailyChart(req, res) {
  try {
    const days = 30 // Últimos 30 dias
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days + 1)
    startDate.setHours(0, 0, 0, 0)

    // Buscar despesas agrupadas por dia
    const result = await Expense.findAll({
      attributes: [
        [Sequelize.fn("date_trunc", "day", Sequelize.col("date")), "day"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn("date_trunc", "day", Sequelize.col("date"))],
      order: [[Sequelize.fn("date_trunc", "day", Sequelize.col("date")), "ASC"]],
    })

    // Formatar dados para o gráfico
    const chartData = {
      labels: [],
      data: [],
    }

    // Inicializar todos os dias com zero
    for (let i = 0; i < days; i++) {
      const day = new Date(startDate)
      day.setDate(day.getDate() + i)
      const dateStr = day.toISOString().split("T")[0]
      chartData.labels.push(dateStr)
      chartData.data.push(0)
    }

    // Preencher com os dados reais
    result.forEach((item) => {
      const dateStr = new Date(item.dataValues.day).toISOString().split("T")[0]
      const index = chartData.labels.indexOf(dateStr)
      if (index !== -1) {
        chartData.data[index] = Number.parseFloat(item.dataValues.total)
      }
    })

    return res.status(200).json({
      success: true,
      chartData,
    })
  } catch (error) {
    console.error("Erro ao obter dados do gráfico diário:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter contatos recentes
export async function getRecentContacts(req, res) {
  try {
    const contacts = await Contact.findAll({
      attributes: ["id", "phoneNumber", "name", "lastInteraction"],
      order: [["lastInteraction", "DESC"]],
      limit: 10,
    })

    return res.status(200).json({
      success: true,
      contacts,
    })
  } catch (error) {
    console.error("Erro ao obter contatos recentes:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter despesas recentes
export async function getRecentExpenses(req, res) {
  try {
    const expenses = await Expense.findAll({
      attributes: ["id", "amount", "description", "date"],
      include: [
        {
          model: Category,
          attributes: ["name", "color"],
        },
        {
          model: Contact,
          attributes: ["phoneNumber", "name"],
        },
      ],
      order: [["date", "DESC"]],
      limit: 10,
    })

    return res.status(200).json({
      success: true,
      expenses,
    })
  } catch (error) {
    console.error("Erro ao obter despesas recentes:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}
