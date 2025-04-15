# FinZap - Bot de Gestão Financeira via WhatsApp

FinZap é um sistema completo de gestão financeira que funciona através do WhatsApp. O bot permite que os usuários registrem despesas, consultem relatórios e recebam insights sobre seus gastos, tudo através de mensagens simples no WhatsApp.

## Funcionalidades

- **Registro de despesas**: Os usuários podem enviar mensagens simples como "camisa 110" e o bot identifica automaticamente a categoria e registra o gasto.
- **Categorização automática**: O sistema categoriza automaticamente as despesas com base em palavras-chave.
- **Categorização inteligente**: Se uma categoria não existir, o sistema cria automaticamente com base na descrição.
- **Relatórios**: Os usuários podem consultar relatórios de gastos com comandos simples como "quanto gastei nos últimos dias?".
- **Gráficos visuais**: O bot envia imagens de gráficos para visualização dos gastos.
- **Dashboard administrativo**: Interface web para gerenciar contatos, categorias e visualizar estatísticas.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **API de WhatsApp**: Evolution API
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, Chart.js

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

\`\`\`
# Servidor
PORT=3000
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_aqui

# Evolution API
EVOLUTION_API_URL=https://bots-financazap-api.c5qiwz.easypanel.host
EVOLUTION_API_KEY=6857EDE252C4-4232-BFAE-F8DF00F435C6
EVOLUTION_INSTANCE_ID=financazap

# Banco de Dados
DATABASE_URL=postgres://postgres:4af5fa6e37e7e1aa6f3a@c5qiwz.easypanel.host:5431/bots?sslmode=disable

# Redis
REDIS_URL=redis://default:5af6b21bac61d0857647@c5qiwz.easypanel.host:6379
\`\`\`

### Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute as migrações: `npm run migrate`
4. Popule o banco de dados com dados iniciais: `npm run seed`
5. Inicie o servidor: `npm start`

## Uso

### Bot do WhatsApp

Os usuários podem interagir com o bot enviando mensagens como:

- **Registrar despesa**: "camisa 110"
- **Consultar gastos recentes**: "quanto gastei nos últimos dias?"
- **Ver gastos do mês**: "quanto gastei esse mês?"
- **Ver categorias**: "mostrar categorias"
- **Ajuda**: "ajuda" ou "help"

### Dashboard Administrativo

Acesse o dashboard administrativo em `http://localhost:3000` (ou o endereço do seu servidor).

Credenciais padrão:
- Email: admin@finzap.com
- Senha: admin123

## Estrutura do Projeto

- **server.js**: Arquivo principal do servidor
- **database/**: Configuração e modelos do banco de dados
- **services/**: Serviços da aplicação (Evolution API, Redis, processamento de mensagens, etc.)
- **controllers/**: Controladores da API
- **routes/**: Rotas da API
- **public/**: Frontend do dashboard administrativo

## Webhook da Evolution API

Configure o webhook da Evolution API para apontar para:
`https://seu-servidor.com/api/webhook/evolution`

## Licença

Este projeto está licenciado sob a licença MIT.
