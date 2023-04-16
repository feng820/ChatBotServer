const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require('@aws-sdk/client-secrets-manager')
const fastifyPlugin = require('fastify-plugin')
const { Configuration, OpenAIApi } = require('openai')

async function retrieveAPIKey(SecretId) {
  // Get the CHATGPT_API_KEY from AWS Secrets Manager
  const secretsManagerClient = new SecretsManagerClient({ region: 'us-west-2' })
  const secret = await secretsManagerClient.send(
    new GetSecretValueCommand({
      SecretId,
    })
  )

  return JSON.parse(secret.SecretString).chatGPTAPIKey
}

async function openAIClient(fastify, options) {
  const apiKey =
    process.env.NODE_ENV === 'localhost'
      ? process.env.CHATGPT_API_KEY
      : await retrieveAPIKey(options.secretId)
  const openai = new OpenAIApi(new Configuration({ apiKey }))
  fastify.decorate('openAIClient', openai)
}

module.exports = fastifyPlugin(openAIClient)
