const express = require('express')
const path = require ('path')
const cors = require ('cors')
const cookieParser = require ('cookie-parser')
const config = require('config')
//const axios = require('axios')
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


server.listen(PORT,() => {console.log(`App is running on port ${PORT}`)})
