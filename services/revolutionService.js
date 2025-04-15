import fetch from "node-fetch"
import { revolutionConfig, validateConfig } from "../config/revolution-api.js"

// Inicializa o serviço e valida a configuração
export function initRevolutionService() {
  validateConfig()
  console.log("Revolution API Service inicializado com sucesso.")
}

// Envia uma mensagem de texto via Revolution API
export async function sendTextMessage(phoneNumber, message) {
  try {
    const url = `${revolutionConfig.baseUrl}${revolutionConfig.endpoints.sendMessage}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revolutionConfig.apiKey}`,
      },
      body: JSON.stringify({
        instanceId: revolutionConfig.instanceId,
        to: formatPhoneNumber(phoneNumber),
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao enviar mensagem via Revolution API:", error)
    throw error
  }
}

// Envia uma imagem via Revolution API
export async function sendImageMessage(phoneNumber, imageUrl, caption = "") {
  try {
    const url = `${revolutionConfig.baseUrl}${revolutionConfig.endpoints.sendImage}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revolutionConfig.apiKey}`,
      },
      body: JSON.stringify({
        instanceId: revolutionConfig.instanceId,
        to: formatPhoneNumber(phoneNumber),
        type: "image",
        image: {
          url: imageUrl,
          caption: caption,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao enviar imagem: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao enviar imagem via Revolution API:", error)
    throw error
  }
}

// Verifica o status da instância do WhatsApp
export async function checkInstanceStatus() {
  try {
    const url = `${revolutionConfig.baseUrl}${revolutionConfig.endpoints.getStatus}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${revolutionConfig.apiKey}`,
      },
      params: {
        instanceId: revolutionConfig.instanceId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro ao verificar status: ${data.message || response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao verificar status via Revolution API:", error)
    throw error
  }
}

// Formata o número de telefone para o padrão esperado pela API
function formatPhoneNumber(phoneNumber) {
  // Remove caracteres não numéricos
  let cleaned = phoneNumber.replace(/\D/g, "")

  // Garante que o número comece com o código do país (assumindo Brasil - 55)
  if (!cleaned.startsWith("55")) {
    cleaned = "55" + cleaned
  }

  return cleaned
}

// Processa uma mensagem recebida da Revolution API
export function processIncomingMessage(webhookData) {
  try {
    // Extrai os dados relevantes do webhook
    const { message, sender } = extractMessageData(webhookData)

    return {
      message,
      sender,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error("Erro ao processar mensagem recebida:", error)
    throw error
  }
}

// Extrai os dados da mensagem do formato da Revolution API
function extractMessageData(webhookData) {
  // Adapte esta função de acordo com o formato real dos webhooks da Revolution API
  // Este é um exemplo genérico

  const messageData = webhookData.data || webhookData

  // Extrai o número do remetente
  const sender = messageData.from || messageData.sender || ""

  // Extrai o conteúdo da mensagem
  let message = ""

  if (messageData.text && messageData.text.body) {
    message = messageData.text.body
  } else if (messageData.body) {
    message = messageData.body
  } else if (messageData.message) {
    message = messageData.message
  }

  return { message, sender }
}
