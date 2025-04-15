"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, PieChart, CreditCard, ShoppingCart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <h1 className="text-2xl font-bold text-emerald-700">FinControle</h1>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-gray-600 mb-6">A mesma tecnologia usada por gerentes de investimentos.</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-emerald-700">Economize</span>{" "}
              <span className="text-orange-400">+ de 300 Reais Em 30 Dias</span>{" "}
              <span className="text-emerald-700">Sem Cortar Os "Luxos" E Apenas Com O Whatsapp.</span>
            </h2>

            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Não é app, nem planilha, nem Notion,{" "}
              <span className="font-bold">é inteligência artificial de ponta.</span>
            </p>

            <Button
              className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-6 rounded-lg text-xl"
              onClick={() => console.log("Continuar clicked")}
            >
              Começar Agora <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <BenefitCard
                icon={<PieChart className="h-8 w-8 text-emerald-600" />}
                title="Para onde vai seu dinheiro?"
                description="Você trabalha o mês inteiro, mas no final nunca sabe onde foi parar tudo que ganhou."
              />

              <BenefitCard
                icon={<CheckCircle className="h-8 w-8 text-emerald-600" />}
                title="Sem planilhas ou apps"
                description="São soluções complicadas que dão preguiça de usar. Aqui você resolve tudo no WhatsApp."
              />

              <BenefitCard
                icon={<CreditCard className="h-8 w-8 text-emerald-600" />}
                title="Perdido nas dívidas"
                description="Não sabe quanto paga de parcela, quanto tempo falta, quem deve, e não tem um plano para pagar."
              />

              <BenefitCard
                icon={<ShoppingCart className="h-8 w-8 text-emerald-600" />}
                title="Pagando mais caro sempre"
                description="Você compra por impulso ou não pesquisa antes, gastando mais e deixando de economizar."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-emerald-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 text-emerald-700">Como Funciona</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StepCard
                number="1"
                title="Conecte-se"
                description="Adicione nosso número no WhatsApp e inicie a conversa."
              />

              <StepCard
                number="2"
                title="Registre gastos"
                description="Envie seus gastos por mensagem de forma simples e rápida."
              />

              <StepCard
                number="3"
                title="Receba insights"
                description="Nossa IA analisa seus gastos e envia dicas personalizadas para economizar."
              />
            </div>

            <div className="mt-12">
              <Button
                className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-6 rounded-lg text-xl"
                onClick={() => console.log("Continuar clicked")}
              >
                Continuar <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 text-emerald-700">O Que Nossos Usuários Dizem</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <TestimonialCard
                name="Carlos Silva"
                quote="Economizei R$450 no primeiro mês usando o FinControle. Nunca foi tão fácil controlar minhas finanças."
              />

              <TestimonialCard
                name="Ana Oliveira"
                quote="Finalmente consegui sair das dívidas! O melhor é que posso usar pelo WhatsApp a qualquer momento."
              />

              <TestimonialCard
                name="Marcos Santos"
                quote="As dicas personalizadas da IA me ajudaram a identificar gastos desnecessários que eu nem percebia."
              />
            </div>
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

function BenefitCard({ icon, title, description }) {
  return (
    <Card className="border-emerald-100 bg-emerald-50 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {icon}
          <h3 className="text-xl font-semibold mt-4 mb-2 text-emerald-700">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-emerald-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, quote }) {
  return (
    <Card className="border-emerald-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <p className="italic mb-4 text-gray-600">"{quote}"</p>
          <p className="font-semibold text-emerald-700">{name}</p>
        </div>
      </CardContent>
    </Card>
  )
}
