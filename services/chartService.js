import { getUserExpenses } from "./expenseService.js"
import { createCanvas } from "canvas"
import fs from "fs"
import path from "path"
import os from "os"

// Gera uma imagem de gráfico baseada nos dados do usuário
export async function generateChartImage(userId, queryType) {
  try {
    // Diretório temporário para salvar a imagem
    const tempDir = path.join(os.tmpdir(), "finzap-charts")

    // Cria o diretório se não existir
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Caminho do arquivo de imagem
    const imagePath = path.join(tempDir, `chart-${userId}-${Date.now()}.png`)

    // Obtém os dados para o gráfico
    const chartData = await getChartData(userId, queryType)

    // Gera a imagem do gráfico
    await createChartImage(chartData, imagePath)

    // Em um ambiente real, você faria upload desta imagem para um serviço de armazenamento
    // e retornaria a URL pública. Aqui, simulamos isso retornando um caminho local.

    // Simulação de URL pública (em produção, seria uma URL real após upload)
    // const publicUrl = `https://storage.example.com/charts/${path.basename(imagePath)}`;

    // Para fins de demonstração, retornamos uma URL de exemplo
    const publicUrl = "https://example.com/chart-image.png"

    return publicUrl
  } catch (error) {
    console.error("Erro ao gerar imagem de gráfico:", error)
    return null
  }
}

// Obtém os dados para o gráfico com base no tipo de consulta
async function getChartData(userId, queryType) {
  let startDate, endDate
  const now = new Date()

  if (queryType === "last_days") {
    // Últimos 7 dias
    startDate = new Date()
    startDate.setDate(now.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)
    endDate = now
  } else if (queryType === "this_month") {
    // Este mês
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = now
  } else {
    // Padrão: últimos 30 dias
    startDate = new Date()
    startDate.setDate(now.getDate() - 29)
    startDate.setHours(0, 0, 0, 0)
    endDate = now
  }

  // Obtém as despesas do período
  const expenses = await getUserExpenses(userId, { startDate, endDate })

  // Organiza os dados por dia
  const dailyData = {}
  const days = []

  // Inicializa o array de dias
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split("T")[0]
    days.push(dateKey)
    dailyData[dateKey] = 0

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Soma as despesas por dia
  expenses.forEach((expense) => {
    const dateKey = new Date(expense.date).toISOString().split("T")[0]
    if (dailyData[dateKey] !== undefined) {
      dailyData[dateKey] += expense.amount
    }
  })

  // Converte para arrays para o gráfico
  const labels = days.map((day) => {
    const date = new Date(day)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  })

  const values = days.map((day) => dailyData[day])

  return { labels, values }
}

// Cria a imagem do gráfico usando canvas
async function createChartImage(chartData, outputPath) {
  const { labels, values } = chartData

  // Configurações do canvas
  const width = 800
  const height = 400
  const padding = 50

  // Cria o canvas
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  // Preenche o fundo
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  // Desenha o título
  ctx.fillStyle = "#333333"
  ctx.font = "bold 20px Arial"
  ctx.textAlign = "center"
  ctx.fillText("Gastos dos Últimos Dias", width / 2, 30)

  // Encontra o valor máximo para escala
  const maxValue = Math.max(...values, 1)
  const roundedMax = Math.ceil(maxValue / 100) * 100

  // Desenha o eixo Y
  ctx.strokeStyle = "#cccccc"
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.stroke()

  // Desenha as linhas horizontais e labels do eixo Y
  ctx.font = "12px Arial"
  ctx.textAlign = "right"
  ctx.fillStyle = "#666666"

  const ySteps = 5
  for (let i = 0; i <= ySteps; i++) {
    const y = height - padding - ((height - 2 * padding) * i) / ySteps
    const value = (roundedMax * i) / ySteps

    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.strokeStyle = "#eeeeee"
    ctx.stroke()

    ctx.fillText(`R$ ${value.toFixed(0)}`, padding - 10, y + 5)
  }

  // Desenha o eixo X
  ctx.strokeStyle = "#cccccc"
  ctx.beginPath()
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Desenha as barras e labels do eixo X
  const barWidth = (width - 2 * padding) / labels.length - 10

  ctx.textAlign = "center"
  ctx.fillStyle = "#666666"

  values.forEach((value, index) => {
    const x = padding + 5 + index * ((width - 2 * padding) / labels.length)
    const barHeight = ((height - 2 * padding) * value) / roundedMax
    const y = height - padding - barHeight

    // Desenha a barra
    ctx.fillStyle = "#4CAF50"
    ctx.fillRect(x, y, barWidth, barHeight)

    // Desenha o valor acima da barra
    ctx.fillStyle = "#333333"
    ctx.font = "12px Arial"
    ctx.fillText(`R$ ${value.toFixed(0)}`, x + barWidth / 2, y - 5)

    // Desenha o label do eixo X
    ctx.fillStyle = "#666666"
    ctx.fillText(labels[index], x + barWidth / 2, height - padding + 20)
  })

  // Salva a imagem
  const buffer = canvas.toBuffer("image/png")
  fs.writeFileSync(outputPath, buffer)
}
