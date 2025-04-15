// Categorias disponíveis
const CATEGORIES = {
  FOOD: "Alimentação",
  TRANSPORT: "Transporte",
  CLOTHING: "Vestuário",
  ENTERTAINMENT: "Lazer",
  HEALTH: "Saúde",
  EDUCATION: "Educação",
  HOUSING: "Moradia",
  UTILITIES: "Contas",
  OTHERS: "Outros",
}

// Palavras-chave para cada categoria
const CATEGORY_KEYWORDS = {
  [CATEGORIES.FOOD]: [
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
  [CATEGORIES.TRANSPORT]: [
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
  ],
  [CATEGORIES.CLOTHING]: [
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
  [CATEGORIES.ENTERTAINMENT]: [
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
  [CATEGORIES.HEALTH]: [
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
  [CATEGORIES.EDUCATION]: [
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
  [CATEGORIES.HOUSING]: [
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
  [CATEGORIES.UTILITIES]: [
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
}

// Categoriza uma despesa com base na descrição
export function categorizeExpense(description) {
  const lowerDescription = description.toLowerCase()

  // Verifica cada categoria
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerDescription.includes(keyword)) {
        return {
          category,
          description: cleanupDescription(lowerDescription, keyword),
        }
      }
    }
  }

  // Se não encontrou nenhuma categoria, retorna Outros
  return {
    category: CATEGORIES.OTHERS,
    description: cleanupDescription(lowerDescription),
  }
}

// Limpa a descrição para exibição
function cleanupDescription(description, matchedKeyword = null) {
  // Capitaliza a primeira letra de cada palavra
  let cleanDescription = description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Se encontrou uma palavra-chave, tenta usá-la como descrição principal
  if (matchedKeyword) {
    const keywordIndex = description.indexOf(matchedKeyword)
    if (keywordIndex >= 0) {
      // Extrai a parte da descrição que contém a palavra-chave e um pouco antes
      const startIndex = Math.max(0, keywordIndex - 10)
      const relevantPart = description.substring(startIndex)

      // Capitaliza a primeira letra
      cleanDescription = relevantPart.charAt(0).toUpperCase() + relevantPart.slice(1)
    }
  }

  return cleanDescription.trim()
}
