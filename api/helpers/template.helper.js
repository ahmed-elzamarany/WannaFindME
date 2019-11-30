/* eslint-disable valid-typeof */
/* eslint-disable max-len */
const notficationhelper = require('./channel.helper')
const { specialvariables } = require('../constants/enums')
const { services } = require('../constants/enums')

const get_variables = (staticText) => {
  const variables = staticText.match(/\${.*?\}/g)
  const vars = []
  let messagevaliderror = ''
  const variabletypes = []
  const specialvariable = []
  variables.forEach((v) => {
    const type = v.split(':')
    if (type.length === 2) {
      const vari = type[0].replace('${', '')
      const vartype = type[1].replace('}', '')
      if (vari.includes(' ')) {
        messagevaliderror = `${messagevaliderror} variable contains spaces${type[0]},`
      }
      if (!(vartype === 'string' || vartype === 'number' || vartype === 'date')) {
        messagevaliderror = `${messagevaliderror}variable has invalid type${type[0]}:${type[1]},`
      }
      staticText = staticText.replace(v, `\${${vari}}`)
      vars.push(vari)
      variabletypes.push(vartype)
    } else {
      const vari = (type[0].replace('${', '')).replace('}', '')
      // eslint-disable-next-line max-len
      if (vari.includes(' ')) {
        messagevaliderror = `${messagevaliderror} variable contains spaces${type[0]},`
      }
      if (vari === specialvariables.FIRSTNAME || vari === specialvariables.LASTNAME || vari === specialvariables.USERNAME) {
        specialvariable.push(vari)
      } else {
        messagevaliderror = `${messagevaliderror}variable has no type or invalid or invalid special variable${vari},`
      }
    }
  })
  const v = [staticText, variabletypes, messagevaliderror, specialvariable, vars]
  return v
}


const create_template = (template, variables, usersData) => {
  let err
  const notifications = []
  let message = ''
  let errmessage = ''
  const specialVars = template.specialVariables
  const {
    staticText
  } = template
  const {
    variablesTypes
  } = template
  const vars = template.variables
  if (variables.length !== vars.length) {
    errmessage = 'number of variables is not correct'
    err = new Error(errmessage)
    return err
  }
  let j = 0
  variablesTypes.forEach((v) => {
    if (v === 'date') {
      if (new Date(variables[j]) === 'Invalid Date') {
        errmessage = `${errmessage + variables[j]} is not of type date,`
      }
    } else if (typeof variables[j] !== v) {
      errmessage = `${errmessage + variables[j]} is not of type ${v},`
    }

    j += 1
  })
  if (errmessage !== '') {
    err = new Error(errmessage)
    return err
  }

  let i = 0
  vars.forEach((v) => {
    v = v.replace('${', '')
    v = v.replace('}', '')
    global[v] = variables[i]
    i += 1
  })

  if (specialVars.length > 0) {
    for (i = 0; i < usersData.length; i += 1) {
      const userData = usersData[i]
      specialVars.forEach((v) => {
        global[v] = userData.dataValues[v]
      })
      // eslint-disable-next-line no-eval
      const specificMessage = eval(`\`${staticText}\``)
      const notification = {
        to: [],
        subject: template.templateName,
        text: specificMessage,
        others: []
      }
      notifications.push(notification)
    }
    return notifications
  }

  // eslint-disable-next-line no-eval
  message = eval(`\`${staticText}\``)
  const notification = {
    to: [],
    subject: template.templateName,
    text: message,
    others: []
  }
  return notification
}

// eslint-disable-next-line max-len
const send_template = async (channels, emails, phones, userArray, subscriptions, notification, notifyId) => {
  channels.forEach(channel => {
    switch (channel) {
      case services.EMAIL:
        notification.to = emails
        notficationhelper.email(false, notification, notifyId, userArray)
        break
      case services.SMS:
        notification.to = phones
        notficationhelper.sms(false, notification, notifyId, userArray)
        break
      case services.WEB:
        notification.to = userArray
        notficationhelper.web_push(notification, subscriptions, notifyId)
        break
      default:
        throw new Error('not a valid type')
    }
  })
}
module.exports = {
  create_template,
  send_template,
  get_variables
}
