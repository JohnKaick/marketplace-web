const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, function (err) {
  if (!err) {
    console.log('Server listening on port ' + port)
  } else {
    console.log('Error starting server: ', err)
  }
})