import { Category, Expense } from "../database/models/index.js"
import { clearCachePattern } from "../services/redisService.js"

// Listar todas as categorias
export async function listCategories(req, res) {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    })

    return res.status(200).json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Erro ao listar categorias:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Obter detalhes de uma categoria
export async function getCategory(req, res) {
  try {
    const { id } = req.params

    // Buscar categoria
    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Categoria não encontrada" })
    }

    // Buscar estatísticas da categoria
    const totalExpenses = await Expense.count({ where: { categoryId: id } })
    const totalAmount = await Expense.sum("amount", { where: { categoryId: id } })

    return res.status(200).json({
      success: true,
      category,
      stats: {
        totalExpenses,
        totalAmount: Number.parseFloat(totalAmount || 0),
      },
    })
  } catch (error) {
    console.error("Erro ao obter detalhes da categoria:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Criar categoria
export async function createCategory(req, res) {
  try {
    const { name, keywords, icon, color } = req.body

    // Validar dados
    if (!name) {
      return res.status(400).json({ success: false, message: "Nome da categoria é obrigatório" })
    }

    // Verificar se já existe categoria com o mesmo nome
    const existingCategory = await Category.findOne({ where: { name } })
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Já existe uma categoria com este nome" })
    }

    // Criar categoria
    const category = await Category.create({
      name,
      keywords: keywords || [],
      icon: icon || "tag",
      color: color || "#3498db",
    })

    // Limpar cache de categorias
    await clearCachePattern("categories")

    return res.status(201).json({
      success: true,
      category,
    })
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Atualizar categoria
export async function updateCategory(req, res) {
  try {
    const { id } = req.params
    const { name, keywords, icon, color } = req.body

    // Buscar categoria
    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Categoria não encontrada" })
    }

    // Verificar se já existe outra categoria com o mesmo nome
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } })
      if (existingCategory) {
        return res.status(400).json({ success: false, message: "Já existe uma categoria com este nome" })
      }
    }

    // Atualizar categoria
    await category.update({
      name: name || category.name,
      keywords: keywords || category.keywords,
      icon: icon || category.icon,
      color: color || category.color,
    })

    // Limpar cache de categorias
    await clearCachePattern("categories")

    return res.status(200).json({
      success: true,
      category,
    })
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Excluir categoria
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params

    // Buscar categoria
    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Categoria não encontrada" })
    }

    // Verificar se é uma categoria padrão
    if (category.isDefault) {
      return res.status(400).json({ success: false, message: "Não é possível excluir categorias padrão" })
    }

    // Verificar se existem despesas associadas
    const expensesCount = await Expense.count({ where: { categoryId: id } })
    if (expensesCount > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Não é possível excluir categorias com despesas associadas" })
    }

    // Excluir categoria
    await category.destroy()

    // Limpar cache de categorias
    await clearCachePattern("categories")

    return res.status(200).json({
      success: true,
      message: "Categoria excluída com sucesso",
    })
  } catch (error) {
    console.error("Erro ao excluir categoria:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}
