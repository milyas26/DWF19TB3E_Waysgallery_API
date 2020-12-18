// Initiate Express
const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()

// Route Module
const routerv1 = require('./src/routes/index')

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.use('/api/v1', routerv1)

const port = 5000
app.listen(port, () => console.log(`This server listening on port ${port}`))
