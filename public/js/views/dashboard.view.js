import { Chart } from "@/components/ui/chart"
import { dashboardService } from "../services/dashboard.service.js"

export class DashboardView {
  constructor() {
    this.stats = null
    this.categoryChart = null
    this.dailyChart = null
    this.recentContacts = null
    this.recentExpenses = null
    this.isLoading = true
    this.error = null
  }

  async render() {
    const container = document.createElement("div")
    container.className = "d-flex"

    // Sidebar
    container.innerHTML = `
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>FinZap</h3>
        </div>
        <ul class="sidebar-menu">
          <li class="active">
            <a href="/dashboard" data-link>
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
          </li>
          <li>
            <a href="/contacts" data-link>
              <i class="fas fa-users"></i> Contatos
            </a>
          </li>
          <li>
            <a href="/categories" data-link>
              <i class="fas fa-tags"></i> Categorias
            </a>
          </li>
          <li>
            <a href="#" id="logout-link">
              <i class="fas fa-sign-out-alt"></i> Sair
            </a>
          </li>
        </ul>
      </div>
      
      <div class="main-content">
        <div class="container-fluid">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
            <div>
              <span class="text-muted me-2">Olá, ${window.app.user?.name || "Usuário"}</span>
            </div>
          </div>
          
          ${this.isLoading ? this.renderLoading() : ""}
          ${this.error ? this.renderError() : ""}
          
          <div id="dashboard-content" ${this.isLoading || this.error ? 'style="display: none;"' : ""}>
            <!-- Estatísticas -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card stat-card bg-primary text-white">
                  <div class="card-body">
                    <div class="icon">
                      <i class="fas fa-users"></i>
                    </div>
                    <div>
                      <div class="stat">${this.stats?.totalContacts || 0}</div>
                      <div class="label">Contatos</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3">
                <div class="card stat-card bg-success text-white">
                  <div class="card-body">
                    <div class="icon">
                      <i class="fas fa-receipt"></i>
                    </div>
                    <div>
                      <div class="stat">${this.stats?.totalExpenses || 0}</div>
                      <div class="label">Despesas</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3">
                <div class="card stat-card bg-warning text-white">
                  <div class="card-body">
                    <div class="icon">
                      <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div>
                      <div class="stat">R$ ${this.formatCurrency(this.stats?.totalAmount || 0)}</div>
                      <div class="label">Total Gasto</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3">
                <div class="card stat-card bg-info text-white">
                  <div class="card-body">
                    <div class="icon">
                      <i class="fas fa-user-clock"></i>
                    </div>
                    <div>
                      <div class="stat">${this.stats?.activeContacts || 0}</div>
                      <div class="label">Contatos Ativos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Gráficos -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title">Gastos por Categoria</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="category-chart" height="300"></canvas>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title">Gastos Diários</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="daily-chart" height="300"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tabelas -->
            <div class="row">
              <div class="col-md-6">
                <div class="table-container">
                  <h5 class="mb-3">Contatos Recentes</h5>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Última Interação</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.renderRecentContacts()}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="table-container">
                  <h5 class="mb-3">Despesas Recentes</h5>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.renderRecentExpenses()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Adicionar evento de logout
    const logoutLink = container.querySelector("#logout-link")
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()
      import("../services/auth.service.js").then((module) => {
        module.authService.logout()
      })
    })

    return container
  }

  async afterRender() {
    try {
      // Carregar dados
      const [statsResponse, categoryChartResponse, dailyChartResponse, recentContactsResponse, recentExpensesResponse] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCategoryChart(),
          dashboardService.getDailyChart(),
          dashboardService.getRecentContacts(),
          dashboardService.getRecentExpenses(),
        ])

      // Atualizar estado
      this.stats = statsResponse.stats
      this.categoryChart = categoryChartResponse.chartData
      this.dailyChart = dailyChartResponse.chartData
      this.recentContacts = recentContactsResponse.contacts
      this.recentExpenses = recentExpensesResponse.expenses
      this.isLoading = false

      // Atualizar conteúdo
      document.getElementById("dashboard-content").style.display = "block"
      document.querySelector(".main-content").innerHTML = ""
      document
        .querySelector(".main-content")
        .appendChild((await this.render()).querySelector(".main-content").firstChild)

      // Renderizar gráficos
      this.renderCharts()
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
      this.isLoading = false
      this.error = error.message || "Erro ao carregar dados"

      // Atualizar conteúdo
      document.getElementById("dashboard-content").style.display = "none"
      const errorElement = document.createElement("div")
      errorElement.className = "alert alert-danger"
      errorElement.textContent = this.error
      document.querySelector(".main-content").appendChild(errorElement)
    }
  }

  renderLoading() {
    return `
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    `
  }

  renderError() {
    return `
      <div class="alert alert-danger">
        ${this.error}
      </div>
    `
  }

  renderRecentContacts() {
    if (!this.recentContacts || this.recentContacts.length === 0) {
      return '<tr><td colspan="4" class="text-center">Nenhum contato encontrado</td></tr>'
    }

    return this.recentContacts
      .map(
        (contact) => `
      <tr>
        <td>${contact.name || "Sem nome"}</td>
        <td>${contact.phoneNumber}</td>
        <td>${this.formatDate(contact.lastInteraction)}</td>
        <td>
          <a href="/contacts/${contact.id}" class="btn btn-sm btn-primary" data-link>
            <i class="fas fa-eye"></i>
          </a>
        </td>
      </tr>
    `,
      )
      .join("")
  }

  renderRecentExpenses() {
    if (!this.recentExpenses || this.recentExpenses.length === 0) {
      return '<tr><td colspan="4" class="text-center">Nenhuma despesa encontrada</td></tr>'
    }

    return this.recentExpenses
      .map(
        (expense) => `
      <tr>
        <td>${expense.description}</td>
        <td>
          <span class="badge" style="background-color: ${expense.Category?.color || "#ccc"}">
            ${expense.Category?.name || "Sem categoria"}
          </span>
        </td>
        <td>R$ ${this.formatCurrency(expense.amount)}</td>
        <td>${this.formatDate(expense.date)}</td>
      </tr>
    `,
      )
      .join("")
  }

  renderCharts() {
    // Gráfico de categorias
    if (this.categoryChart && this.categoryChart.length > 0) {
      const ctx = document.getElementById("category-chart").getContext("2d")
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: this.categoryChart.map((item) => item.category),
          datasets: [
            {
              data: this.categoryChart.map((item) => item.total),
              backgroundColor: this.categoryChart.map((item) => item.color),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      })
    }

    // Gráfico de gastos diários
    if (this.dailyChart && this.dailyChart.labels && this.dailyChart.data) {
      const ctx = document.getElementById("daily-chart").getContext("2d")
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.dailyChart.labels.map((date) => {
            const d = new Date(date)
            return `${d.getDate()}/${d.getMonth() + 1}`
          }),
          datasets: [
            {
              label: "Gastos Diários (R$)",
              data: this.dailyChart.data,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "R$ " + value,
              },
            },
          },
        },
      })
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  formatCurrency(value) {
    return Number.parseFloat(value).toFixed(2).replace(".", ",")
  }
}
