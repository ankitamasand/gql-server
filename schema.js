const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

const {
    Page,
    convertNodeToCursor,
    convertCursorToNodeId
} = require('./pagination')

const MenuItem = new GraphQLObjectType({
    name: 'MenuItemType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
    })
})

const Restaurant = new GraphQLObjectType({
    name: 'RestaurantType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        location: { type: GraphQLString },
        menu: { type: GraphQLList(MenuItem) }
    })
})

const Customer = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        location: { type: GraphQLString }
    })
})

const Order = new GraphQLObjectType({
    name: 'OrderType',
    fields: () => ({
        id: { type: GraphQLString },
        customerId: { type: GraphQLString },
        restaurantId: { type: GraphQLString },
        order: { type: GraphQLList(GraphQLString) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        restaurants: {
            type: Page(Restaurant),
            args: {
                first: { type: GraphQLInt },
                afterCursor: { type: GraphQLString }
            },
            resolve (parentValue, args) {

                let { first, afterCursor } = args
                let afterIndex = 0

                return axios.get(`http://localhost:4200/restaurants`)
                    .then(res => {
                        let data = res.data

                        if (typeof afterCursor === 'string') {
                            /* Extracting nodeId from afterCursor */
                            let nodeId = convertCursorToNodeId(afterCursor)
                            /* Finding the index of nodeId */
                            let nodeIndex = data.findIndex(datum => datum.id === nodeId)
                            if (nodeIndex >= 0) {
                                afterIndex = nodeIndex + 1 // 1 is added to exclude the afterIndex node and include items after it
                            }
                        }

                        const slicedData = data.slice(afterIndex, afterIndex + first)
                        const edges = slicedData.map (node => ({
                            node,
                            cursor: convertNodeToCursor(node)
                        }))

                        let startCursor, endCursor = null
                        if (edges.length > 0) {
                            startCursor = convertNodeToCursor(edges[0].node)
                            endCursor = convertNodeToCursor(edges[edges.length - 1].node)
                        }
                        let hasNextPage = data.length > afterIndex + first

                        return {
                            totalCount: data.length,
                            edges,
                            pageInfo: {
                                startCursor,
                                endCursor,
                                hasNextPage
                            }
                        }
                })
            }
        },
        restaurant: {
            type: Restaurant,
            args: {
                id: { type: GraphQLString }
            },
            resolve (parentValue, args) {
                return axios.get(`http://localhost:4200/restaurants/${args.id}`)
                    .then(res => res.data)
            }
        },
        customers: {
            type: GraphQLList(Customer),
            resolve (parentValue, args) {
                return axios.get(`http://localhost:4200/customers`)
                    .then(res => res.data)
            }
        },
        customer: {
            type: Customer,
            args: {
                id: { type: GraphQLString }
            },
            resolve (parentValue, args) {
                return axios.get(`http://localhost:4200/customers/${args.id}`)
                    .then(res => res.data)
            }
        },
        orders: {
            type: GraphQLList(Order),
            resolve (parentValue, args) {
                return axios.get(`http://localhost:4200/orders`)
                    .then(res => res.data)
            }
        },
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addOrder: {
            type: Order,
            args: {
                customerId: { type: new GraphQLNonNull(GraphQLString) },
                restaurantId: { type: new GraphQLNonNull(GraphQLString) },
                order: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) }
            },
            resolve (parentValue, args) {
                let { customerId, restaurantId, order } = args
                return axios.post(`http://localhost:4200/orders`, {
                    customerId,
                    restaurantId,
                    order
                }).then(res => res.data)
            }
        },
        updateOrder: {
            type: Order,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                order: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) }
            },
            resolve (parentValue, args) {
                let { id, order } = args
                return axios.patch(`http://localhost:4200/orders/${id}`, {
                    order
                }).then(res => res.data)
            }
        },
        deleteOrder: {
            type: Order,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve (parentValue, args) {
                let { id, order } = args
                return axios.delete(`http://localhost:4200/orders/${id}`)
                    .then(res => res.data)
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
