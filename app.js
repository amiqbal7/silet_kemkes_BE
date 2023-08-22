require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./routes/index.js')

app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: '*'
}))
app.use(morgan('tiny'))
app.disable('x-powered-by') 
app.use(express.json())
app.use('/api',router)

app.get('/', (req, res) => {
  console.log('Response Success!')
  res.send('Response Success!')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`)
})