const restify = require('restify')
const builder = require('botbuilder')
const parse = require('./src/parse')

const server = restify.createServer();
server.listen(process.env.MICROSOFT_APP_PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', connector.listen());

// TODO: many rolls in one command
const ROLL_REGEX = /{.+?}/g
const bot = new builder.UniversalBot(connector, function (session) {
  const text = session.message.text
  const rolls = text.match(ROLL_REGEX) || []
  if (!rolls) return

  let results = []
  for (const roll of rolls) {
    try {
      results.push(parse(roll.split(/[{}]/)[1]))
    } catch (e) {
      continue
    } 
  }

  session.send("(%s; %s)", session.message.user.name, results.join(', '))
})
