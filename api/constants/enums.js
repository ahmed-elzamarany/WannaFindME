const logs_state = {
  SUCCESS: 'succeeded',
  PENDING: 'pending',
  FAILED: 'failed',
}
const services = {
  EMAIL: 'email',
  SMS: 'sms',
  WEB: 'push',
  NOTIFY: 'notify'
}

const specialvariables = {
  USERNAME: 'username',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName'

}
const templatesStates = {
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated'
}
module.exports = {
  services, specialvariables, logs_state, templatesStates
}
