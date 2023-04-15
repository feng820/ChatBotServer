const { Stack } = require('aws-cdk-lib')

// const sqs = require('aws-cdk-lib/aws-sqs');
const { ChatBotServerLambda } = require('./chat_bot_server_lambda')

class ChatBotServerCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props)

    // The code that defines your stack goes here
    new ChatBotServerLambda(this, 'ChatBotServerLambda')

    // example resource
    // const queue = new sqs.Queue(this, 'TestCdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { ChatBotServerCdkStack }
