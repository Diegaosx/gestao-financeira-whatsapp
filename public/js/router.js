import { LoginView } from "./views/login.view.js"
import { DashboardView } from "./views/dashboard.view.js"
import { ContactsView } from "./views/contacts.view.js"
import { ContactDetailView } from "./views/contact-detail.view.js"
import { CategoriesView } from "./views/categories.view.js"
import { CategoryDetailView } from "./views/category-detail.view.js"
import { NotFoundView } from "./views/not-found.view.js"

// Definição das rotas
const routes = [
  { path: "/login", view: LoginView, auth: false },
  { path: "/dashboard", view: DashboardView, auth: true },
  { path: "/contacts", view: ContactsView, auth: true },
  { path: "/contacts/:id", view: ContactDetailView, auth: true },
  { path: "/categories", view: CategoriesView, auth: true },
  { path: "/categories/:id", view: CategoryDetailView, auth: true },
  { path: "/", redirect: "/dashboard" },
]

// Router
export const router = {
  async loadRoute(url) {
    // Verificar redirecionamentos
    const potentialRedirect = routes.find((route) => route.path === url && route.redirect)
    if (potentialRedirect) {
      window.history.replaceState(null, null, potentialRedirect.redirect)
      return this.loadRoute(potentialRedirect.redirect)
    }

    // Encontrar rota correspondente
    const route = this.matchRoute(url) || { view: NotFoundView, auth: false }

    // Verificar autenticação
    if (route.auth && !window.app.user) {
      window.history.replaceState(null, null, "/login")
      return this.loadRoute("/login")
    }

    if (route.path === "/login" && window.app.user) {
      window.history.replaceState(null, null, "/dashboard")
      return this.loadRoute("/dashboard")
    }

    // Atualizar rota atual
    window.app.currentRoute = route

    // Renderizar view
    const view = new route.view(this.getParams(route, url))
    const appContainer = document.getElementById("app")
    appContainer.innerHTML = ""
    appContainer.appendChild(await view.render())

    // Executar script após renderização
    if (view.afterRender) {
      await view.afterRender()
    }
  },

  matchRoute(url) {
    // Remover query string e hash
    const cleanUrl = url.split("?")[0].split("#")[0]

    for (const route of routes) {
      // Rota exata
      if (route.path === cleanUrl) {
        return route
      }

      // Rota com parâmetros
      if (route.path.includes(":")) {
        const routeParts = route.path.split("/")
        const urlParts = cleanUrl.split("/")

        if (routeParts.length !== urlParts.length) {
          continue
        }

        let match = true
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(":")) {
            continue
          }
          if (routeParts[i] !== urlParts[i]) {
            match = false
            break
          }
        }

        if (match) {
          return route
        }
      }
    }

    return null
  },

  getParams(route, url) {
    const params = {}

    if (route.path.includes(":")) {
      const routeParts = route.path.split("/")
      const urlParts = url.split("/")

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          const paramName = routeParts[i].substring(1)
          params[paramName] = urlParts[i]
        }
      }
    }

    return params
  },
}
