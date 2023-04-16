const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require('@aws-sdk/client-secrets-manager')
const fastifyPlugin = require('fastify-plugin')
const { Configuration, OpenAIApi } = require('openai')

async function retrieveAPISecrets(SecretId) {
  // Get the CHATGPT_API_KEY from AWS Secrets Manager
  const secretsManagerClient = new SecretsManagerClient({ region: 'us-west-2' })
  const secret = await secretsManagerClient.send(
    new GetSecretValueCommand({
      SecretId,
    })
  )

  return JSON.parse(secret.SecretString)
}

async function openAIClient(fastify, options) {
  const apiKey = await retrieveAPISecrets(options.secretId)
  const openai = new OpenAIApi(
    new Configuration({ apiKey: apiKey.chatGPTAPIKey })
  )
  fastify.decorate('openAIClient', openai)
}

module.exports = fastifyPlugin(openAIClient)
