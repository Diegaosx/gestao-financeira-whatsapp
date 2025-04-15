// Módulo principal da aplicação
import { router } from "./router.js"
import { authService } from "./services/auth.service.js"

// Estado global da aplicação
const app = {
  currentRoute: null,
  user: null,
  isLoading: false,
}

// Inicializar aplicação
async function initApp() {
  // Verificar se o usuário está autenticado
  try {
    app.isLoading = true
    const user = await authService.verifyToken()
    if (user) {
      app.user = user
      navigateTo(window.location.pathname || "/dashboard")
    } else {
      navigateTo("/login")
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    navigateTo("/login")
  } finally {
    app.isLoading = false
  }

  // Adicionar listener para navegação
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault()
      navigateTo(e.target.getAttribute("href"))
    }
  })

  // Adicionar listener para eventos de navegação do navegador
  window.addEventListener("popstate", () => {
    router.loadRoute(window.location.pathname)
  })
}

// Função para navegação
function navigateTo(url) {
  window.history.pushState(null, null, url)
  router.loadRoute(url)
}

// Expor funções e objetos globalmente
window.app = app
window.navigateTo = navigateTo

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", initApp)
