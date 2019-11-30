const uuidv1 = require('uuid/v1')
const sqs = require('../../config/SQSconfig')
const { QueueUrl } = require('../../config/keys')

exports.push_queue = async (type, NotifyId, Notification) => {
  const params = {
    MessageBody: type,
    QueueUrl,
    MessageDeduplicationId: uuidv1(),
    MessageGroupId: NotifyId,
    MessageAttributes: {
      Notification: {
        DataType: 'String',
        StringValue: JSON.stringify(Notification)
      }
    }
  }
  await sqs.sendMessage(params).promise()
}
