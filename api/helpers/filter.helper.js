
const account_filter_by_email = (accounts, emailFilter) => {
  let filtered = []
  console.log(accounts)
  if (emailFilter.includes('gmail'))
    filtered = filtered.concat(accounts.filter(account => (account.dataValues.email).includes('gmail')))

  if (emailFilter.includes('hotmail'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.email.includes('hotmail')))

  if (emailFilter.includes('guc.edu.eg'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.email.includes('guc.edu.eg')))

  if (emailFilter.includes('yahoo'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.email.includes('yahoo')))

  if (emailFilter.includes('lirten'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.email.includes('lirten')))

  return filtered
}

const account_filter_by_phone_number = (accounts, numberFilter) => {
  let filtered = []
  if (numberFilter.includes('etisalat'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.phoneNumber.includes('+2011')))

  if (numberFilter.includes('vodafone'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.phoneNumber.includes('+2010')))

  if (numberFilter.includes('we'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.phoneNumber.includes('+2015')))

  if (numberFilter.includes('orange'))
    filtered = filtered.concat(accounts.filter(account => account.dataValues.phoneNumber.includes('+2012')))

  return filtered
}


module.exports = {
  account_filter_by_email,
  account_filter_by_phone_number,
}
