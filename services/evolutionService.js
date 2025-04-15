import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const API_URL = process.env.EVOLUTION_API_URL
const API_KEY = process.env.EVOLUTION_API_KEY
const INSTANCE_ID = process.env.EVOLUTION_INSTANCE_ID

// Enviar mensagem de texto
async function sendTextMessage(phoneNumber, text) {
  try {
    // Formatar número de telefone
    const formattedNumber = formatPhoneNumber(phoneNumber)

    const url = `${API_URL}/message/sendText/${INSTANCE_ID}`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify({
        number: formattedNumber,
        textMessage: {
          text: text,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao enviar mensagem via Evolution API:", error)
    throw error
  }
}

// Enviar imagem
async function sendImageMessage(phoneNumber, imageUrl, caption = "") {
  try {
    // Formatar número de telefone
    const formattedNumber = formatPhoneNumber(phoneNumber)

    const url = `${API_URL}/message/sendMedia/${INSTANCE_ID}`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify({
        number: formattedNumber,
        mediaMessage: {
          mediaType: "image",
          fileName: `chart-${Date.now()}.jpg`,
          caption: caption,
          media: imageUrl,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao enviar imagem: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao enviar imagem via Evolution API:", error)
    throw error
  }
}

// Verificar status da instância
async function checkInstanceStatus() {
  try {
    const url = `${API_URL}/instance/connectionState/${INSTANCE_ID}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao verificar status: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao verificar status via Evolution API:", error)
    throw error
  }
}

// Formatar número de telefone
function formatPhoneNumber(phoneNumber) {
  // Remove caracteres não numéricos
  let cleaned = phoneNumber.replace(/\D/g, "")

  // Garante que o número comece com o código do país (assumindo Brasil - 55)
  if (!cleaned.startsWith("55")) {
    cleaned = "55" + cleaned
  }

  return cleaned
}

// Processar mensagem recebida do webhook
function processWebhookMessage(webhookData) {
  try {
    // Verificar se é uma mensagem válida
    if (!webhookData || !webhookData.data) {
      throw new Error("Dados de webhook inválidos")
    }

    const data = webhookData.data

    // Verificar se é uma mensagem de texto
    if (data.messageType !== "conversation" && data.messageType !== "extendedTextMessage") {
      return {
        isValid: false,
        reason: `Tipo de mensagem não suportado: ${data.messageType}`,
      }
    }

    // Extrair informações da mensagem
    const sender = data.from || ""
    const message = data.body || ""
    const timestamp = new Date(data.timestamp * 1000 || Date.now())

    return {
      isValid: true,
      sender,
      message,
      timestamp,
    }
  } catch (error) {
    console.error("Erro ao processar mensagem do webhook:", error)
    return {
      isValid: false,
      reason: error.message,
    }
  }
}

export { sendTextMessage, sendImageMessage, checkInstanceStatus, processWebhookMessage }
