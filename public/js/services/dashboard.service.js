import { apiService } from "./api.service.js"

// Serviço do dashboard
export const dashboardService = {
  // Obter estatísticas
  async getStats() {
    return apiService.get("/api/dashboard/stats")
  },

  // Obter dados do gráfico de categorias
  async getCategoryChart() {
    return apiService.get("/api/dashboard/chart/category")
  },

  // Obter dados do gráfico diário
  async getDailyChart() {
    return apiService.get("/api/dashboard/chart/daily")
  },

  // Obter contatos recentes
  async getRecentContacts() {
    return apiService.get("/api/dashboard/contacts/recent")
  },

  // Obter despesas recentes
  async getRecentExpenses() {
    return apiService.get("/api/dashboard/expenses/recent")
  },
}
