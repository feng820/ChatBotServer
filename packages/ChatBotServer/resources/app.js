const cors = require('@fastify/cors')
const fastify = require('fastify')

const chatGPTRoutes = require('./routes/chatgpt')

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})
app.register(cors, {
  origin: [`http://l1ocalhost:${process.env.PORT}`, process.env.WEBAPP_ORIGIN],
  methods: ['GET', 'POST'],
})
app.register(chatGPTRoutes)

if (require.main == module) {
  // called directly i.e. "node app"
  const start = async () => {
    try {
      await app.listen({ port: process.env.PORT || 5000 })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
  start()
} else {
  // required as a module => executed on aws lambda
  module.exports = app
}
