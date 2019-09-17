const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { createServer } = require('http')
const mongoose = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: 'http://localhost:3000/graphql',
        settings: {
            'editor.theme': 'light'
        }
    }
})
server.applyMiddleware({ app })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

mongoose
    .connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0-yhukr.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`)
    .then( (res) => {
        httpServer.listen(3000, () => {
            console.log('connected!')
        })
    })
    .catch( (err) => {
        console.error('Error while connecting to MongoDB', err);
    })
