import { createClient } from "redis"
import dotenv from "dotenv"

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on("error", (err) => {
  console.error("Erro no Redis:", err)
})

redisClient.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!")
})

// Iniciar conexão
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  return redisClient
}

// Obter valor do cache
async function getCache(key) {
  const client = await connectRedis()
  return await client.get(key)
}

// Definir valor no cache
async function setCache(key, value, expireSeconds = 3600) {
  const client = await connectRedis()
  await client.set(key, value)
  if (expireSeconds > 0) {
    await client.expire(key, expireSeconds)
  }
}

// Remover valor do cache
async function deleteCache(key) {
  const client = await connectRedis()
  await client.del(key)
}

// Limpar cache por padrão
async function clearCachePattern(pattern) {
  const client = await connectRedis()
  const keys = await client.keys(pattern)
  if (keys.length > 0) {
    await client.del(keys)
  }
}

export { getCache, setCache, deleteCache, clearCachePattern, connectRedis }
