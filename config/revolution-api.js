// Configurações da Revolution API para WhatsApp
export const revolutionConfig = {
  // Substitua com suas credenciais reais da Revolution API
  apiKey: process.env.REVOLUTION_API_KEY,
  instanceId: process.env.REVOLUTION_INSTANCE_ID,
  baseUrl: "https://api.revolution.chat",
  webhookPath: "/webhook/revolution",

  // Endpoints da API
  endpoints: {
    sendMessage: "/api/v1/send-message",
    sendImage: "/api/v1/send-image",
    sendDocument: "/api/v1/send-document",
    getStatus: "/api/v1/status",
  },
}

// Verifica se as configurações necessárias estão presentes
export function validateConfig() {
  if (!revolutionConfig.apiKey) {
    throw new Error("Revolution API Key não configurada. Defina a variável de ambiente REVOLUTION_API_KEY.")
  }

  if (!revolutionConfig.instanceId) {
    throw new Error("Revolution Instance ID não configurado. Defina a variável de ambiente REVOLUTION_INSTANCE_ID.")
  }

  return true
}
