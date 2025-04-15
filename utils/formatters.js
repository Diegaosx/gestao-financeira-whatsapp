// Formata uma data para exibição
export function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Gera dados para um gráfico de barras
export function generateChartData(dailyTotals, labels) {
  // Esta função seria usada para gerar dados para um gráfico
  // que seria enviado como imagem para o WhatsApp

  // Em um cenário real, você usaria uma biblioteca como Chart.js
  // para gerar a imagem do gráfico e enviá-la

  return {
    labels,
    data: dailyTotals,
  }
}

// Formata um valor monetário
export function formatCurrency(value) {
  return `R$ ${value.toFixed(2)}`
}
