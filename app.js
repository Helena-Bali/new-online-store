const express = require('express')
const path = require ('path')
const cors = require ('cors')
const cookieParser = require ('cookie-parser')
const config = require('config')
const axios = require('axios')
const { readFile, writeFile, unlink} = require('fs').promises

const server = express()

const PORT = config.get('port') || 5000

const middleware = [
    cors(),
    express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
    express.json({ limit: '50mb', extended: true }),
    cookieParser()
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/goods', async (req,res) => {
    const readGoods = await readFile(`${__dirname}/server-data/goods.json`)
        .then(f => JSON.parse(f))
        .catch(() => ({message: 'There is no goods here'}))
    res.json(readGoods)
})

server.get('/api/v1/rates', async (req, res) => {
    await axios('https://api.currencyapi.com/v3/latest?apikey=Kmcg16vIZioibH63W2Mtb9NjqWccCPO4kIWP6wFG',
        {headers: { "Accept-Encoding": "gzip,deflate,compress" }})
        .then(response => res.json(response.data.data))
        .catch(err => next(err))
} )

if (process.env.NODE_ENV === 'production&&') {
    server.use(express.static(path.join(__dirname), 'client', 'build'))
    server.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

server.listen(PORT,() => {console.log(`App is running on port ${PORT}`)})
