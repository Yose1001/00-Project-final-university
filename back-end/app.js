require('dotenv').config()
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-route')
const todoRoute = require('./routes/todo-route')

const app = express()

app.use(cors())
app.use(express.json())

// request logger — shows every API call + result status in the terminal
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    const mark = res.statusCode < 400 ? '✅' : '❌'
    console.log(`${mark} ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`)
  })
  next()
})

// service
app.use('/auth', authRoute)
app.use('/Reservation', todoRoute)

// notFound
app.use( notFound )

// error
app.use(errorMiddleware)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))