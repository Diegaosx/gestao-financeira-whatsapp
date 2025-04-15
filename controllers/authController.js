import { User } from "../database/models/index.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // Validar dados
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email e senha são obrigatórios" })
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } })

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" })
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ success: false, message: "Usuário desativado" })
    }

    // Verificar senha
    const isPasswordValid = await user.checkPassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" })
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    // Retornar token e dados do usuário
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

// Verificar token
export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ success: false, message: "Token não fornecido" })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar usuário
    const user = await User.findByPk(decoded.id)

    if (!user || !user.active) {
      return res.status(401).json({ success: false, message: "Usuário inválido ou desativado" })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return res.status(401).json({ success: false, message: "Token inválido ou expirado" })
  }
}

// Middleware de autenticação
export function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ success: false, message: "Token não fornecido" })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    console.error("Erro de autenticação:", error)
    return res.status(401).json({ success: false, message: "Token inválido ou expirado" })
  }
}

// Middleware de autorização para admin
export function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Acesso negado. Permissão de administrador necessária." })
  }
  next()
}
