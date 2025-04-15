import { apiService } from "./api.service.js"

// Serviço de contatos
export const contactService = {
  // Listar contatos
  async listContacts(page = 1, limit = 10, search = "") {
    const query = new URLSearchParams({ page, limit })
    if (search) {
      query.append("search", search)
    }
    return apiService.get(`/api/contacts?${query}`)
  },

  // Obter detalhes de um contato
  async getContact(id) {
    return apiService.get(`/api/contacts/${id}`)
  },

  // Atualizar contato
  async updateContact(id, data) {
    return apiService.put(`/api/contacts/${id}`, data)
  },

  // Listar mensagens de um contato
  async getContactMessages(id, page = 1, limit = 20) {
    const query = new URLSearchParams({ page, limit })
    return apiService.get(`/api/contacts/${id}/messages?${query}`)
  },

  // Listar despesas de um contato
  async getContactExpenses(id, page = 1, limit = 20, startDate = null, endDate = null) {
    const query = new URLSearchParams({ page, limit })
    if (startDate) {
      query.append("startDate", startDate)
    }
    if (endDate) {
      query.append("endDate", endDate)
    }
    return apiService.get(`/api/contacts/${id}/expenses?${query}`)
  },

  // Enviar mensagem para um contato
  async sendMessage(id, message) {
    return apiService.post(`/api/contacts/${id}/send-message`, { message })
  },
}
