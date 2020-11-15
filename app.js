import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

const corsOptions = {
    origin: ['http://localhost:3000'],
}

app.use(cors(corsOptions))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// set port, listen for requests
const PORT = process.env.PORT || 9991
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

app.get('/', (req, res) => {
    const pathToHTML = `${__dirname}\\public\\index.html`

    res.sendFile(pathToHTML)
})
