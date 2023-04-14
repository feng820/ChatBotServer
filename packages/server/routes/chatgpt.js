const { Configuration, OpenAIApi } = require('openai')

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.CHATGPT_API_KEY,
  })
)

const MAX_TOKEN_SIZE = 1000

const chatMessageReplyOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          reply: { type: 'string' },
        },
      },
    },
  },
}

function chatGPTRoutes(fastify, options, done) {
  fastify.post('/api/chat', chatMessageReplyOptions, async (req, reply) => {
    try {
      const resp = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: req.body.message }],
        max_tokens: MAX_TOKEN_SIZE,
      })

      const replyMessage = resp.data.choices[0].message.content
      reply.send({ reply: replyMessage })
    } catch (error) {
      console.log(error)
      switch (error.response && error.response.status) {
        case 400:
          reply.code(400).send({ error: error.response.statusText })
          break
        case 401:
          reply.code(401).send({ error: 'Unauthorized to access OpenAI API' })
          break
        case 429:
          reply.code(429).send({
            error: 'Too many requests to OpenAI API. Please try again later.',
          })
          break
        default:
          throw new Error('Unexpected error while calling OpenAI API')
      }
    }
  })

  done()
}

module.exports = chatGPTRoutes
