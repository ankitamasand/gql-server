const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Menu {
        id: Int,
        name: String,
        price: Float
    }

    type Restaurant {
        id: Int,
        name: String,
        email: String,
        location: String,
        menu: [Menu]
    }

    type Customer {
        id: Int,
        name: String,
        email: String,
        location: String
    }

    type Order {
        id: Int
        customerId: Int
        restaurantId: Int
        order: [String]
    }

    type Query {
        restaurants: [Restaurant],
        restaurant (id: Int): Restaurant,
        customers: [Customer],
        customer (id: Int): Customer,
        orders: [Order],
        order (id: Int): Order
    }
`

module.exports = typeDefs
