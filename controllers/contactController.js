import { Contact, Expense, Message, Category } from "../database/models/index.js"
import { Op, Sequelize } from "sequelize"
import { sendTextMessage } from "../services/evolutionService.js"

// Listar todos os contatos
export async function listContacts(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query
    const offset = (page - 1) * limit

    // Construir condição de busca
    const whereCondition = {}
    if (search) {
      whereCondition[Op.or] = [{ phoneNumber: { [Op.iLike]: `%${search}%` } }, { name: { [Op.iLike]: `%${search}%` } }]
    }

    // Buscar contatos
    const { count, rows } = await Contact.findAndCountAll({
      where: whereCondition,
      order: [["lastInteraction", "DESC"]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    })

    return res.status(200).json({
      success: true,
      contacts: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number.parseInt(page),
    })
  } catch (error) {
    console.error("Erro ao listar contatos:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter detalhes de um contato
export async function getContact(req, res) {
  try {
    const { id } = req.params

    // Buscar contato
    const contact = await Contact.findByPk(id)

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contato não encontrado" })
    }

    // Buscar estatísticas do contato
    const totalExpenses = await Expense.count({ where: { contactId: id } })
    const totalAmount = await Expense.sum("amount", { where: { contactId: id } })

    // Buscar categorias mais usadas
    const categories = await Expense.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Expense.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        },
      ],
      where: { contactId: id },
      group: ["Category.id", "Category.name", "Category.color"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("Expense.id")), "DESC"]],
      limit: 5,
    })

    return res.status(200).json({
      success: true,
      contact,
      stats: {
        totalExpenses,
        totalAmount: Number.parseFloat(totalAmount || 0),
        topCategories: categories.map((cat) => ({
          id: cat.Category.id,
          name: cat.Category.name,
          color: cat.Category.color,
          count: Number.parseInt(cat.dataValues.count),
          total: Number.parseFloat(cat.dataValues.total),
        })),
      },
    })
  } catch (error) {
    console.error("Erro ao obter detalhes do contato:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Atualizar contato
export async function updateContact(req, res) {
  try {
    const { id } = req.params
    const { name, monthlyBudget } = req.body

    // Buscar contato
    const contact = await Contact.findByPk(id)

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contato não encontrado" })
    }

    // Atualizar contato
    await contact.update({
      name: name || contact.name,
      monthlyBudget: monthlyBudget !== undefined ? monthlyBudget : contact.monthlyBudget,
    })

    return res.status(200).json({
      success: true,
      contact,
    })
  } catch (error) {
    console.error("Erro ao atualizar contato:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Listar mensagens de um contato
export async function getContactMessages(req, res) {
  try {
    const { id } = req.params
    const { page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    // Verificar se o contato existe
    const contact = await Contact.findByPk(id)

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contato não encontrado" })
    }

    // Buscar mensagens
    const { count, rows } = await Message.findAndCountAll({
      where: { contactId: id },
      order: [["timestamp", "DESC"]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    })

    return res.status(200).json({
      success: true,
      messages: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number.parseInt(page),
    })
  } catch (error) {
    console.error("Erro ao listar mensagens do contato:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Listar despesas de um contato
export async function getContactExpenses(req, res) {
  try {
    const { id } = req.params
    const { page = 1, limit = 20, startDate, endDate } = req.query
    const offset = (page - 1) * limit

    // Verificar se o contato existe
    const contact = await Contact.findByPk(id)

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contato não encontrado" })
    }

    // Construir condição de data
    const whereCondition = { contactId: id }
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      }
    } else if (startDate) {
      whereCondition.date = {
        [Op.gte]: new Date(startDate),
      }
    } else if (endDate) {
      whereCondition.date = {
        [Op.lte]: new Date(endDate),
      }
    }

    // Buscar despesas
    const { count, rows } = await Expense.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        },
      ],
      order: [["date", "DESC"]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    })

    return res.status(200).json({
      success: true,
      expenses: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number.parseInt(page),
    })
  } catch (error) {
    console.error("Erro ao listar despesas do contato:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Enviar mensagem para um contato
export async function sendMessage(req, res) {
  try {
    const { id } = req.params
    const { message } = req.body

    // Verificar se o contato existe
    const contact = await Contact.findByPk(id)

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contato não encontrado" })
    }

    // Validar mensagem
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Mensagem não pode ser vazia" })
    }

    // Enviar mensagem via Evolution API
    await sendTextMessage(contact.phoneNumber, message)

    // Salvar mensagem no banco de dados
    const savedMessage = await Message.create({
      content: message,
      direction: "outgoing",
      timestamp: new Date(),
      messageType: "text",
      contactId: contact.id,
    })

    return res.status(200).json({
      success: true,
      message: savedMessage,
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}
