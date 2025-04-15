import { authService } from "../services/auth.service.js"

export class LoginView {
  constructor() {
    this.isLoading = false
    this.errorMessage = ""
  }

  async render() {
    const container = document.createElement("div")
    container.className = "login-container"
    container.innerHTML = `
      <div class="text-center mb-4">
        <h2 class="mb-3">FinZap</h2>
        <p class="text-muted">Faça login para acessar o dashboard</p>
      </div>
      
      ${this.errorMessage ? `<div class="alert alert-danger">${this.errorMessage}</div>` : ""}
      
      <form id="login-form">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" required>
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Senha</label>
          <input type="password" class="form-control" id="password" required>
        </div>
        
        <button type="submit" class="btn btn-primary w-100" id="login-button" ${this.isLoading ? "disabled" : ""}>
          ${this.isLoading ? '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...' : "Entrar"}
        </button>
      </form>
    `

    // Adicionar evento de submit
    const form = container.querySelector("#login-form")
    form.addEventListener("submit", this.handleSubmit.bind(this))

    return container
  }

  async handleSubmit(e) {
    e.preventDefault()

    if (this.isLoading) return

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
      this.isLoading = true
      this.errorMessage = ""

      // Atualizar botão
      const button = document.getElementById("login-button")
      button.disabled = true
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...'

      // Fazer login
      const user = await authService.login(email, password)

      // Atualizar estado global
      window.app.user = user

      // Redirecionar para o dashboard
      window.navigateTo("/dashboard")
    } catch (error) {
      this.errorMessage = error.message || "Erro ao fazer login"

      // Renderizar novamente com mensagem de erro
      const container = document.getElementById("app")
      container.innerHTML = ""
      container.appendChild(await this.render())
    } finally {
      this.isLoading = false
    }
  }
}
