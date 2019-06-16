const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Menu {
        _id: String,
        name: String,
        price: Float
    }

    type Restaurant {
        _id: String,
        name: String,
        email: String,
        location: String,
        menu: [Menu]
    }

    type Customer {
        _id: String,
        name: String,
        email: String,
        location: String
    }

    type Order {
        _id: String,
        customerId: String,
        restaurantId: String,
        order: [String]
    }

    type Query {
        restaurants: [Restaurant],
        restaurant (id: String): Restaurant,
        customers: [Customer],
        customer (id: String): Customer,
        orders: [Order],
        order (id: String): Order
    }

    input MenuItem {
        name: String,
        price: Float
    }

    type Mutation {
        addRestaurant (name: String, email: String, location: String, menu: [MenuItem]): Restaurant,
        addCustomer (name: String, email: String, location: String): Customer,
        addOrder (customerId: String, restaurantId: String, order: [String]): Order
    }
`

module.exports = typeDefs
