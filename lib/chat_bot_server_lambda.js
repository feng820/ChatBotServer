const apiGatewayV2 = require('aws-cdk-lib/aws-apigatewayv2')
const iam = require('aws-cdk-lib/aws-iam')
const lambda = require('aws-cdk-lib/aws-lambda')
const nodejsLambda = require('aws-cdk-lib/aws-lambda-nodejs')
const secretsManager = require('aws-cdk-lib/aws-secretsmanager')
const { Construct } = require('constructs')

const CHATGPT_API_KEY_SECRET_ID = 'chatGPT_secret_key'

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
          CHATGPT_API_KEY_SECRET_ID,
        },
        bundling: {
          minify: true,
        },
      }
    )

    const chatGPTAPISecret = secretsManager.Secret.fromSecretNameV2(
      this,
      'CHATGPT_API_KEY_SECRET_ID',
      CHATGPT_API_KEY_SECRET_ID
    )
    chatGPTAPISecret.grantRead(handler)

    const httpApi = new apiGatewayV2.CfnApi(this, 'ChatBotAPI', {
      name: 'ChatBot API',
      protocolType: 'HTTP',
      target: handler.functionArn,
    })
    handler.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'))
  }
}

module.exports = { ChatBotServerLambda }
