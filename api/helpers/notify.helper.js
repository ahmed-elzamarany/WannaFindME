const Notify = require('../../models/notify.model')

const store_logs = async (service, notifyId, user, templateText, status, code) => {
  const Item = {
    service,
    notifyId,
    user,
    templateText,
    templateCode: code,
    date: new Date().toISOString(),
    state: status
  }

  try {
    await Notify.create(Item)
  } catch (err) {
    console.log(err)
  }
}

const update_logs = async (service, notifyId, user, state) => {
  const log = await Notify.findOne({ where: {
    service,
    notifyId,
    user }
  })
  await log.update({
    state
  })
}


module.exports = {
  store_logs,
  update_logs
}
