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
  handler: async function (req, reply) {
    try {
      const resp = await req.server.openAIClient.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: req.body.message }],
        max_tokens: MAX_TOKEN_SIZE,
      })

      const replyMessage = resp.data.choices[0].message.content
      reply.send({ reply: replyMessage })
    } catch (error) {
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
  },
}

async function chatGPTRoutes(fastify) {
  fastify.post('/api/chat', chatMessageReplyOptions)
}

module.exports = chatGPTRoutes
