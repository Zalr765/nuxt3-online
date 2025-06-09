// server/api/online-users.ts
import { defineEventHandler, setResponseHeader } from 'h3'

const clients = new Set()

export default defineEventHandler((event) => {
  // Устанавливаем SSE заголовки
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  // Пишем стартовый пробел (иначе может не работать в некоторых браузерах)
  event.node.res.write(':\n\n')

  clients.add(event)

  // Шлём обновление клиенту
  const send = () => {
    event.node.res.write(`data: ${JSON.stringify({ count: clients.size })}\n\n`)
  }

  send() // при подключении

  const interval = setInterval(send, 5000) // обновление каждые 5 сек

  // Обработка отключения клиента
  event.node.req.on('close', () => {
    clearInterval(interval)
    clients.delete(event)
  })
})
