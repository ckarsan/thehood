const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({ req }),
})

startStandaloneServer(server, {
  context: async ({ req }) => ({ req }),
  listen: { port: PORT },
}).then(({ url }) => {
  console.log(`Server is running at ${url}`)
})
