// Serviço de autenticação
export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login")
      }

      // Salvar token no localStorage
      localStorage.setItem("token", data.token)

      return data.user
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  },

  // Verificar token
  async verifyToken() {
    const token = localStorage.getItem("token")

    if (!token) {
      return null
    }

    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        this.logout()
        throw new Error(data.message || "Token inválido")
      }

      return data.user
    } catch (error) {
      console.error("Erro ao verificar token:", error)
      this.logout()
      return null
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("token")
    window.app.user = null
    window.navigateTo("/login")
  },

  // Obter token
  getToken() {
    return localStorage.getItem("token")
  },
}
