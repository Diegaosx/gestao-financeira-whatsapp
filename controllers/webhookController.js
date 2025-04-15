import { processMessage, handleUserQuery } from "../services/messageProcessor.js"
import { sendTextMessage, sendImageMessage, processWebhookMessage } from "../services/evolutionService.js"
import { Contact, Expense, Category, Message } from "../database/models/index.js"
import { generateWeeklyChartImage, generateMonthlyChartImage } from "../services/reportService.js"
import fs from "fs"

// Processar webhook da Evolution API
export async function handleEvolutionWebhook(req, res) {
  try {
    console.log("Webhook recebido da Evolution API:", JSON.stringify(req.body))

    // Processar a mensagem recebida
    const messageData = processWebhookMessage(req.body)

    // Verificar se a mensagem é válida
    if (!messageData.isValid) {
      console.log("Mensagem inválida:", messageData.reason)
      return res.status(200).json({ success: true, message: "Mensagem inválida ignorada" })
    }

    // Responder ao webhook rapidamente para evitar timeouts
    res.status(200).json({ success: true })

    // Processar a mensagem em background
    await handleIncomingMessage(messageData.message, messageData.sender, messageData.timestamp)
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Processar mensagem recebida
async function handleIncomingMessage(message, sender, timestamp) {
  try {
    // Encontrar ou criar contato
    const [contact] = await Contact.findOrCreate({
      where: { phoneNumber: sender },
      defaults: {
        phoneNumber: sender,
        name: `Usuário ${sender.substring(sender.length - 4)}`,
        lastInteraction: timestamp,
      },
    })

    // Atualizar última interação
    if (contact.lastInteraction < timestamp) {
      await contact.update({ lastInteraction: timestamp })
    }

    // Salvar mensagem recebida
    await Message.create({
      content: message,
      direction: "incoming",
      timestamp,
      messageType: "text",
      contactId: contact.id,
    })

    // Processar a mensagem
    const processedMessage = await processMessage(message, sender)

    if (processedMessage.type === "expense") {
      // Salvar a despesa no banco de dados
      const savedExpense = await Expense.create({
        amount: processedMessage.amount,
        description: processedMessage.description,
        date: processedMessage.date,
        originalMessage: processedMessage.originalMessage,
        contactId: contact.id,
        categoryId: processedMessage.categoryId,
      })

      // Buscar categoria para resposta
      const category = await Category.findByPk(processedMessage.categoryId)

      // Formatar a resposta para o usuário
      const response = formatExpenseResponse(savedExpense, category)

      // Salvar mensagem enviada
      await Message.create({
        content: response,
        direction: "outgoing",
        timestamp: new Date(),
        messageType: "expense",
        contactId: contact.id,
      })

      // Enviar a resposta via Evolution API
      await sendTextMessage(sender, response)

      console.log("Resposta enviada para o usuário:", response)
    } else if (processedMessage.type === "query") {
      // Processar consultas como "quanto gastei nos últimos dias?"
      const queryResponse = await handleUserQuery(sender, processedMessage.query)

      // Salvar mensagem enviada
      await Message.create({
        content: queryResponse,
        direction: "outgoing",
        timestamp: new Date(),
        messageType: "report",
        contactId: contact.id,
      })

      // Enviar a resposta de texto
      await sendTextMessage(sender, queryResponse)

      // Se for uma consulta de últimos dias, gera e envia um gráfico
      if (processedMessage.query === "last_days") {
        try {
          // Gera uma imagem de gráfico
          const chartImage = await generateWeeklyChartImage(contact.id)

          if (chartImage) {
            // Enviar a imagem
            await sendImageMessage(
              sender,
              `file://${chartImage.filePath}`,
              "Gráfico dos seus gastos dos últimos 7 dias",
            )

            // Limpar arquivo temporário após envio
            setTimeout(() => {
              try {
                fs.unlinkSync(chartImage.filePath)
              } catch (err) {
                console.error("Erro ao remover arquivo temporário:", err)
              }
            }, 5000)
          }
        } catch (chartError) {
          console.error("Erro ao gerar ou enviar gráfico:", chartError)
        }
      } else if (processedMessage.query === "this_month") {
        try {
          // Gera uma imagem de gráfico mensal
          const chartImage = await generateMonthlyChartImage(contact.id)

          if (chartImage) {
            // Enviar a imagem
            await sendImageMessage(
              sender,
              `file://${chartImage.filePath}`,
              "Gráfico dos seus gastos por categoria este mês",
            )

            // Limpar arquivo temporário após envio
            setTimeout(() => {
              try {
                fs.unlinkSync(chartImage.filePath)
              } catch (err) {
                console.error("Erro ao remover arquivo temporário:", err)
              }
            }, 5000)
          }
        } catch (chartError) {
          console.error("Erro ao gerar ou enviar gráfico mensal:", chartError)
        }
      }

      console.log("Resposta para consulta enviada:", queryResponse)
    } else {
      // Mensagem não reconhecida
      const response =
        "Desculpe, não entendi. Tente enviar um gasto como 'camisa 110' ou uma pergunta como 'quanto gastei nos últimos dias?'. Digite 'ajuda' para ver os comandos disponíveis."

      // Salvar mensagem enviada
      await Message.create({
        content: response,
        direction: "outgoing",
        timestamp: new Date(),
        messageType: "text",
        contactId: contact.id,
      })

      await sendTextMessage(sender, response)

      console.log("Resposta para mensagem não reconhecida enviada:", response)
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error)

    // Enviar mensagem de erro para o usuário
    try {
      await sendTextMessage(sender, "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.")
    } catch (sendError) {
      console.error("Erro ao enviar mensagem de erro:", sendError)
    }
  }
}

// Formatar resposta de despesa
function formatExpenseResponse(expense, category) {
  const formattedDate = expense.date.toLocaleDateString("pt-BR")
  const currentTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return `Gasto adicionado\n📌 ${expense.description.toUpperCase()} (${category.name})\nR$ ${Number.parseFloat(expense.amount).toFixed(2)}\n\n${formattedDate}\n\n${currentTime}`
}
