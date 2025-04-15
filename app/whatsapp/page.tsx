"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

export default function WhatsAppDemo() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-4 md:px-6 flex items-center">
          <Link href="/" className="flex items-center text-emerald-700">
            <ArrowLeft className="mr-2" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <h1 className="text-2xl font-bold text-emerald-700 mx-auto">Demo do FinControle</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="bg-emerald-600 text-white">
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2" />
                FinControle WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-[#e5ded8] p-4 min-h-[400px]">
                <div className="space-y-4">
                  {/* Bot messages */}
                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>Olá! Sou o assistente financeiro do FinControle. Como posso te ajudar hoje?</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>Posso te ajudar a:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Registrar despesas e receitas</li>
                        <li>Mostrar relatórios dos seus gastos</li>
                        <li>Dar dicas para economizar</li>
                        <li>Criar um plano para quitar dívidas</li>
                      </ul>
                    </div>
                  </div>

                  {/* User messages */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-100 rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>Quero registrar uma despesa</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>Claro! Por favor, me informe:</p>
                      <p>1. Valor gasto</p>
                      <p>2. Categoria (alimentação, transporte, lazer, etc.)</p>
                      <p>3. Data (ou deixe em branco para hoje)</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-emerald-100 rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>R$ 45,90 restaurante hoje</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                      <p>✅ Despesa registrada com sucesso!</p>
                      <p className="font-semibold">R$ 45,90 - Restaurante - Hoje</p>
                      <p className="mt-2">Você já gastou R$ 320,50 em alimentação este mês (64% do seu limite).</p>
                      <p className="mt-2">
                        Dica: Considere preparar mais refeições em casa para economizar até R$ 200 por mês.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t flex">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button className="rounded-l-none bg-emerald-600 hover:bg-emerald-700">
                  <Send size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="mb-4 text-gray-600">Experimente agora mesmo e comece a economizar!</p>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={() => console.log("WhatsApp clicked")}
            >
              <MessageCircle className="mr-2" />
              Iniciar Conversa no WhatsApp
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-emerald-800 text-white py-6">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>© 2023 FinControle. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
