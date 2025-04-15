import { apiService } from "./api.service.js"

// Serviço de categorias
export const categoryService = {
  // Listar categorias
  async listCategories() {
    return apiService.get("/api/categories")
  },

  // Obter detalhes de uma categoria
  async getCategory(id) {
    return apiService.get(`/api/categories/${id}`)
  },

  // Criar categoria
  async createCategory(data) {
    return apiService.post("/api/categories", data)
  },

  // Atualizar categoria
  async updateCategory(id, data) {
    return apiService.put(`/api/categories/${id}`, data)
  },

  // Excluir categoria
  async deleteCategory(id) {
    return apiService.delete(`/api/categories/${id}`)
  },
}
