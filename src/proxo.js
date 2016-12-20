const express = require('express')
const minimist = require('minimist')

const app = express();
const url = require('url')
const http = require('http');
const httpProxy = require('http-proxy');


help = `
Example:

    proxo --port 3000 \\
      --rule /::http://localhost:3001 \\
      --rule /api::https://api.server.com

Will forward all requests at 127.0.0.1:3000 to localhost:3001
but the ones to 127.0.0.1:3000/api to https://api.server.com/api
`


if (!module.parent) {
  const defaults = {
    port: process.env.PORT || 3000,
    rule: []
  }
  const options = Object.assign({}, defaults, minimist(process.argv))
  if (!Array.isArray(options.rule)) { options.rule = [options.rule]}
  if (options.h || options.help) { console.log(help); process.exit(0)}

  options.rule.forEach(function (rool) {
    rool = (rool + '').split('::')
    const path = rool[0]
    const destination = rool[1]
    console.log('Rule: requests to ' + path + ' will be sent to ' + destination)

    const proxy = httpProxy.createProxyServer({});
    app.use(path, (req, res, next) => {

      // adjust request
      if (path.length > 1) { req.url = path + req.url }
      req.headers.host = url.parse(destination).host || req.headers.host

      console.log('Proxy forwarding:', req.url, '=>', destination)

      proxy.web(req, res, { target: destination }, (error) => {
        console.log(`Proxy ERROR contacting ${destination}${req.url}`, error)
      })
    });

  })

  console.log('Proxy listening on port', options.port);
  app.listen(options.port)
}
