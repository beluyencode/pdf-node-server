const express = require('express')
const app = express()
const port = 5000
app.use(express.static("public"));

app.get('/*', (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname })
})

app.get('/2', (req, res) => {
    res.sendFile('public/test.html', { root: __dirname })
})
app.get('/3', (req, res) => {
    res.sendFile('public/prevnext.html', { root: __dirname })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})