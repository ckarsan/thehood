const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const mongoose = require('mongoose')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/thehood'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected to thehood'))
  .catch(err => console.error('MongoDB connection error:', err))

const startServer = async () => {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()

  app.use(cors())
  app.use(express.json())

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  )

  // Serve static files from the client build directory
  app.use(express.static(path.join(__dirname, '../client/dist')))

  // Handle client-side routing by returning index.html for all other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
  })
}

startServer()
