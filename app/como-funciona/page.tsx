"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, MessageCircle, PieChart } from "lucide-react"
import Link from "next/link"

export default function ComoFunciona() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <Link href="/">
            <h1 className="text-2xl font-bold text-emerald-700">FinControle</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-emerald-700">Como o FinControle Funciona</h2>

            <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-600">
              Nosso sistema utiliza inteligência artificial avançada para analisar seus hábitos financeiros e te ajudar
              a economizar sem sacrificar sua qualidade de vida.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 text-emerald-700">1. Conecte-se via WhatsApp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Adicione nosso número ao seu WhatsApp e inicie uma conversa. Não é necessário baixar nenhum
                      aplicativo ou criar contas complicadas.
                    </p>
                    <ul className="space-y-2">
                      {["Sem downloads", "Sem cadastros complexos", "Sem planilhas complicadas"].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Card className="bg-emerald-50 border-emerald-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-xs">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                              <MessageCircle size={20} />
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold">FinControle</p>
                              <p className="text-xs text-gray-500">Online</p>
                            </div>
                          </div>
                          <p className="text-sm">
                            Olá! Sou o assistente financeiro do FinControle. Como posso te ajudar hoje?
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 text-emerald-700">2. Registre seus gastos facilmente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <Card className="bg-emerald-50 border-emerald-100 md:order-2">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm">Por favor, me informe:</p>
                          <p className="text-sm">1. Valor gasto</p>
                          <p className="text-sm">2. Categoria</p>
                          <p className="text-sm">3. Data (opcional)</p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-lg shadow-sm ml-auto max-w-[80%]">
                          <p className="text-sm">R$ 45,90 restaurante hoje</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm">✅ Despesa registrada com sucesso!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="md:order-1">
                    <p className="text-gray-600 mb-4">
                      Registre seus gastos de forma simples e rápida, usando linguagem natural. Nosso sistema entende o
                      que você escreve e categoriza automaticamente.
                    </p>
                    <ul className="space-y-2">
                      {["Registro rápido em segundos", "Categorização automática", "Linguagem natural"].map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-emerald-700">3. Receba insights personalizados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Nossa IA analisa seus padrões de gastos e oferece dicas personalizadas para economizar dinheiro
                      sem abrir mão do que você gosta.
                    </p>
                    <ul className="space-y-2">
                      {["Análise de padrões de gastos", "Dicas personalizadas", "Alertas de economia"].map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <Card className="bg-emerald-50 border-emerald-100">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm font-semibold">Relatório Semanal</p>
                          <div className="mt-2">
                            <p className="text-sm">Você economizou R$ 87,50 esta semana! 🎉</p>
                            <p className="text-sm mt-1">
                              Dica: Identificamos que você poderia economizar R$ 120 em delivery este mês pedindo com
                              mais antecedência e aproveitando promoções.
                            </p>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <PieChart className="h-5 w-5 text-emerald-600 mr-2" />
                            <p className="text-sm font-semibold">Distribuição de Gastos</p>
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Alimentação</span>
                              <span>35%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Transporte</span>
                              <span>25%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Lazer</span>
                              <span>20%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-emerald-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-8 text-emerald-700">Pronto para começar a economizar?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              Junte-se a milhares de pessoas que já estão economizando com o FinControle.
            </p>
            <Button
              className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-6 rounded-lg text-xl"
              onClick={() => console.log("Começar agora clicked")}
            >
              Começar Agora <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-800 text-white py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>© 2023 FinControle. Todos os direitos reservados.</p>
          <p className="mt-2 text-emerald-200">Transformando sua relação com o dinheiro através da tecnologia.</p>
        </div>
      </footer>
    </div>
  )
}
