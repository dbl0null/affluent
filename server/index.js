const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const config = require('../config')
const app = express()
const affluentService = require('./services/affluent')
const reqresService = require('./services/reqres')
const BasicModel = require('./lib/basicModel')

app.use('/', express.static(__dirname + '/../client/dist'))

app.use(cors())
app.use(morgan('tiny'))

const datesModel = new BasicModel('dates')
const usersModel = new BasicModel('users')

app.get('/dates/collect', async (req, res) => {
  const data = await affluentService.getData()
  await datesModel.createMany(data)
  res.json({status: 'ok', count: data.length})
})

app.get('/users/collect', async (req, res) => {
  const data = await reqresService.getData()
  await usersModel.createMany(data)
  res.json({status: 'ok', count: data.length})
})

app.get('/users', async (req, res) => res.json(await usersModel.getAll()))
app.get('/dates', async (req, res) => res.json(await datesModel.getAll()))


// error handler
app.use((err, request, response, next) => {
  console.error(err)
  response.status(500).send(`server-side error: ${config.app.debug ? err.message : 'check logs'}`)
})

app.listen(config.app.port, err => {
  err ? console.error('error:', err) : console.log(`server is listening on ${config.app.port}`)
})