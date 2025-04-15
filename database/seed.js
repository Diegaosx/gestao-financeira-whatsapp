import { Category, User } from "./models/index.js"
import dotenv from "dotenv"

dotenv.config()

const defaultCategories = [
  {
    name: "Alimentação",
    keywords: [
      "restaurante",
      "lanche",
      "almoço",
      "jantar",
      "café",
      "mercado",
      "supermercado",
      "pizza",
      "hamburguer",
      "comida",
      "delivery",
      "ifood",
      "padaria",
      "açougue",
      "feira",
      "hortifruti",
    ],
    icon: "utensils",
    color: "#e74c3c",
    isDefault: true,
  },
  {
    name: "Transporte",
    keywords: [
      "uber",
      "99",
      "taxi",
      "táxi",
      "ônibus",
      "onibus",
      "metrô",
      "metro",
      "trem",
      "combustível",
      "combustivel",
      "gasolina",
      "álcool",
      "alcool",
      "estacionamento",
      "pedágio",
      "pedagio",
      "passagem",
      "bilhete",
      "diesel",
      "óleo",
      "oleo",
    ],
    icon: "car",
    color: "#3498db",
    isDefault: true,
  },
  {
    name: "Vestuário",
    keywords: [
      "roupa",
      "camisa",
      "camiseta",
      "calça",
      "calca",
      "vestido",
      "sapato",
      "tênis",
      "tenis",
      "meia",
      "cueca",
      "calcinha",
      "sutiã",
      "sutia",
      "jaqueta",
      "casaco",
      "blusa",
      "shorts",
      "bermuda",
      "pijama",
    ],
    icon: "tshirt",
    color: "#9b59b6",
    isDefault: true,
  },
  {
    name: "Lazer",
    keywords: [
      "cinema",
      "teatro",
      "show",
      "ingresso",
      "netflix",
      "spotify",
      "prime",
      "disney",
      "hbo",
      "jogo",
      "game",
      "livro",
      "revista",
      "bar",
      "balada",
      "festa",
      "viagem",
      "passeio",
      "parque",
    ],
    icon: "film",
    color: "#f39c12",
    isDefault: true,
  },
  {
    name: "Saúde",
    keywords: [
      "remédio",
      "remedio",
      "farmácia",
      "farmacia",
      "médico",
      "medico",
      "consulta",
      "exame",
      "hospital",
      "dentista",
      "psicólogo",
      "psicologo",
      "terapia",
      "academia",
      "vitamina",
      "suplemento",
    ],
    icon: "heartbeat",
    color: "#2ecc71",
    isDefault: true,
  },
  {
    name: "Educação",
    keywords: [
      "escola",
      "faculdade",
      "universidade",
      "curso",
      "livro didático",
      "material escolar",
      "mensalidade",
      "aula",
      "professor",
      "tutor",
      "apostila",
      "caderno",
      "caneta",
    ],
    icon: "graduation-cap",
    color: "#1abc9c",
    isDefault: true,
  },
  {
    name: "Moradia",
    keywords: [
      "aluguel",
      "condomínio",
      "condominio",
      "iptu",
      "reforma",
      "móveis",
      "moveis",
      "decoração",
      "decoracao",
      "eletrodoméstico",
      "eletrodomestico",
      "casa",
      "apartamento",
    ],
    icon: "home",
    color: "#34495e",
    isDefault: true,
  },
  {
    name: "Contas",
    keywords: [
      "luz",
      "água",
      "agua",
      "gás",
      "gas",
      "internet",
      "telefone",
      "celular",
      "tv",
      "streaming",
      "conta",
      "boleto",
      "fatura",
    ],
    icon: "file-invoice-dollar",
    color: "#7f8c8d",
    isDefault: true,
  },
  {
    name: "Outros",
    keywords: [],
    icon: "ellipsis-h",
    color: "#95a5a6",
    isDefault: true,
  },
]

const defaultAdmin = {
  name: "Administrador",
  email: "admin@finzap.com",
  password: "admin123",
  role: "admin",
}

async function seed() {
  try {
    // Criar categorias padrão
    for (const category of defaultCategories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category,
      })
    }
    console.log("Categorias padrão criadas com sucesso!")

    // Criar usuário admin padrão
    await User.findOrCreate({
      where: { email: defaultAdmin.email },
      defaults: defaultAdmin,
    })
    console.log("Usuário admin criado com sucesso!")

    console.log("Seed concluído com sucesso!")
    process.exit(0)
  } catch (error) {
    console.error("Erro durante o seed:", error)
    process.exit(1)
  }
}

seed()
