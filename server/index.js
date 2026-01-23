const express = require('express')
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/thehood'

app.use(cors())
app.use(express.json())

const reportsRoutes = require('./routes/reports')

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected to thehood'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use('/api/reports', reportsRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gotham City Backend Online' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
