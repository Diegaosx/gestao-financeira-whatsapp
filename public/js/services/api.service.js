import { authService } from "./auth.service.js"

// Serviço de API
export const apiService = {
  // Fazer requisição autenticada
  async request(url, options = {}) {
    const token = authService.getToken()

    if (!token) {
      throw new Error("Usuário não autenticado")
    }

    // Configurar headers
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Fazer requisição
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Se o token expirou, fazer logout
        if (response.status === 401) {
          authService.logout()
        }

        throw new Error(data.message || "Erro na requisição")
      }

      return data
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error)
      throw error
    }
  },

  // GET
  async get(url) {
    return this.request(url)
  },

  // POST
  async post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // PUT
  async put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // DELETE
  async delete(url) {
    return this.request(url, {
      method: "DELETE",
    })
  },
}
