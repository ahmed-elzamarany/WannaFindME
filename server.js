/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const allRoutes = require('express-list-endpoints')
// Require Router Handlers
const follow = require('./api/routes/follow.route')
const location = require('./api/routes/location.route')
const user = require('./api/routes/user.route')

const app = express()
const port = process.env.PORT || 5000

// Init middleware
app.use(express.json())
app.use(cors())

const explore = (req, res) => {
  const routes = allRoutes(app)
  const result = {
    ServiceList: []
  }
  routes.forEach(route => {
    const name = route.path.split('/')[5]
    result.ServiceList.push({
      Service: {
        name,
        fullUrl: `http://localhost:${port}${route.path}`
      }
    })
  })
  return res.json(result)
}
// import db configurationig
const sequelize = require('./config/DBconfig')

// test postgres connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to postgres 💪 .')
  })
  .catch(err => {
    console.error('Unable to connect to postgres 😳 .', err)
  })

// Direct to Route Handlers
app.use('/explore', explore)
app.use('/api/findme/follow', follow)
app.use('/api/findme/location', location)
app.use('/api/findme/user', user)

app.use((req, res) => {
  res.status(404).send({ err: 'No such url' })
})

const eraseDatabaseOnSync = false
sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(() => console.log('Synced models with database 💃 .'))
  .catch(error => console.log('Could not sync models with database 🤦 .', error))

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'))
//     app.get('*', (req,res) => {
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }

app.listen(port, () => console.log(`Server up and running on ${port} 👍`))
