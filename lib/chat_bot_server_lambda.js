const lambda = require('aws-cdk-lib/aws-lambda')
const nodejsLambda = require('aws-cdk-lib/aws-lambda-nodejs')
const secretsManager = require('aws-cdk-lib/aws-secretsmanager')
const { Construct } = require('constructs')

class ChatBotServerLambda extends Construct {
  constructor(scope, id) {
    super(scope, id)

    const handler = new nodejsLambda.NodejsFunction(
      this,
      'ChatBotServerHandler',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: 'resources/lambda.js',
        environment: {
          NODE_ENV: 'prod',
        },
      }
    )

    const chatGPTAPISecret = secretsManager.Secret.fromSecretNameV2(
      this,
      'CHATGPT_API_KEY_SECRET_ID',
      process.env.CHATGPT_API_KEY_SECRET_ID
    )
    chatGPTAPISecret.grantRead(handler)
  }
}

module.exports = { ChatBotServerLambda }
