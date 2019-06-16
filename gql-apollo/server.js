const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const mongoose = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app })

mongoose
    .connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0-yhukr.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`)
    .then( (res) => {
        app.listen({ port: 3000 }, () => {
            console.log('Your Apollo Server is running on port 3000')
        })
    })
    .catch( (err) => {
        console.error('Error while connecting to MongoDB', err);
    })
