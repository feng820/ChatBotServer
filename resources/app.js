const fastify = require('fastify')

const openAIClient = require('./plugins/openai')
const chatGPTRoutes = require('./routes/chatgpt')

const app = fastify()
app.register(openAIClient, { secretId: process.env.CHATGPT_API_KEY_SECRET_ID })
app.register(chatGPTRoutes)

if (require.main == module) {
  // called directly i.e. "node app"
  const start = async () => {
    try {
      await app.listen({ port: 5000 })
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
