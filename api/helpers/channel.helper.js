const nodemailer = require('nodemailer')
const webPush = require('web-push')
const {
  accountSid,
  authToken,
  publicVapidKey,
  privateVapidKey,
  emailPass,
  phoneNumber,
  lirtenEmail
} = require('../../config/keys')

const {
  services,
  logs_state
} = require('../constants/enums')
const { push_queue } = require('./sqs.helper')

// eslint-disable-next-line import/order
const client = require('twilio')(accountSid, authToken)
const {
  store_logs
} = require('./notify.helper')

const encapsulate_notification = (req) => {
  const notification = {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
    others: req.body.others
  }
  return notification
}
const get_user_ids = (emails, user_array) => {
  const userIds = []
  emails.forEach(email => {
    const index = emails.indexOf(email)
    userIds.push(user_array[index])
  })
  return userIds
}

const email = async (stored, notification, notifyId, user_array) => {
  const {
    to
  } = notification
  const {
    subject
  } = notification
  const {
    text
  } = notification
  const {
    others
  } = notification
  let userIds = get_user_ids(to, user_array)

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: lirtenEmail,
      pass: emailPass
    }
  })
  const mailOptions = {
    from: lirtenEmail, // sender address
    to, // reciever email
    subject, // Subject line
    text: `'Hello,\n'${text}\n\n\n\nPlease do not reply to this message, this service is automated\nLirten Hub©`,
    attachments: others
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    if (info.accepted.length > 0) {
      userIds = get_user_ids(info.accepted, user_array)
      if (!stored)
        store_logs(services.EMAIL, notifyId, userIds, text, logs_state.SUCCESS, notification.code)
    }
    if (info.rejected.length > 0) {
      userIds = get_user_ids(info.rejected, user_array)
      throw new Error('rejected')
    }
    return 'succeeded'
  } catch (err) {
    notification.user_array = userIds
    notification.to = to
    console.log(err)
    push_queue(services.EMAIL, notifyId, notification)
    if (!stored)
      store_logs(services.EMAIL, notifyId, userIds, text, logs_state.PENDING, notification.code)
    return 'failed'
  }
}
const singleEmail = async (notification) => {
  const {
    to
  } = notification
  const {
    subject
  } = notification
  const {
    text
  } = notification
  const {
    others
  } = notification

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: lirtenEmail,
      pass: emailPass
    }
  })
  const mailOptions = {
    from: lirtenEmail, // sender address
    to, // reciever email
    subject, // Subject line
    text: `'Hello,\n'${text}\n\n\n\nPlease do not reply to this message, this service is automated\nLirten Hub©`,
    attachments: others
  }
  try {
    const info = await transporter.sendMail(mailOptions)

    if (info.rejected.length > 0) {
      throw new Error('rejected')
    }
    return 'succeeded'
  } catch (err) {
    return err.message
  }
}
const help_SMS = async (stored, notifi, notifyId, userId) => {
  const {
    to
  } = notifi
  const {
    text
  } = notifi

  try {
    await client.messages.create({
      body: text,
      // Keys!
      from: phoneNumber,
      to
    })
    if (!stored)
      store_logs(services.SMS, notifyId, [userId], text, logs_state.SUCCESS, notifi.code)

    return 'succeeded'
  } catch (err) {
    notifi.user_array = [userId]
    notifi.to = to
    push_queue(services.SMS, notifyId, notifi)
    if (!stored) store_logs(services.SMS, notifyId, [userId], text, logs_state.PENDING, notifi.code)
    return 'failed'
  }
}

const sms = async (stored, notification, notifyId, user_array) => {
  const {
    to
  } = notification
  const smsIDs = []
  for (let i = 0; i < to.length; i = 1 + i) {
    notification.to = to[i]
    const msg = help_SMS(stored, notification, notifyId, user_array[i])
    smsIDs.push(msg)
  }

  return Promise.all(smsIDs)
}
const singleSMS = async (notifi) => {
  const {
    to
  } = notifi
  const {
    text
  } = notifi

  try {
    await client.messages.create({
      body: text,
      from: phoneNumber,
      to
    })
    return 'succeeded'
  } catch (err) {
    return err.message
  }
}

const help_push = async (payload, subscriptions) => {
  const req = []
  for (let counter = 0; counter < subscriptions.length; counter += 1) {
    for (let i = 0; i < subscriptions[counter].length; i += 1) {
      const web = webPush.sendNotification(JSON.parse(subscriptions[counter]), payload)
      req.push(web) } }
}
const web_push = async (notification, subscriptions) => {
  const payload = JSON.stringify({
    title: notification.subject,
    body: notification.text
  })
  webPush.setVapidDetails('mailto:notification.system.lirten.hub@gmail.com', publicVapidKey, privateVapidKey)
  help_push(payload, subscriptions)
}

module.exports = {
  email,
  sms,
  encapsulate_notification,
  web_push,
  singleSMS,
  singleEmail
}
