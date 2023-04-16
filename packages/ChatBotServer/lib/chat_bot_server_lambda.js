const lambda = require('aws-cdk-lib/aws-lambda')
const { Construct } = require('constructs')

class ChatBotServerLambda extends Construct {
  constructor(scope, id) {
    super(scope, id)

    const handler = new lambda.Function(this, 'ChatBotServerHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('resources'),
      handler: 'lambda.handler',
    })
  }
}

module.exports = { ChatBotServerLambda }
