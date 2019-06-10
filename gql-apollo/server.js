const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app })

app.listen({ port: 3000 }, () => {
    console.log('Your Apollo Server is running on port 3000')
})
