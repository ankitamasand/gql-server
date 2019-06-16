const { Restaurant, Customer, Order } = require('./models.js')

const resolvers = {
    Query: {
        restaurants (parent, args, context, info) {
            return Restaurant.find()
                .then (restaurant => {
                    return restaurant.map (r => ({ ...restaurant._doc }))
                })
                .catch (err => {
                    console.error(err)
                })
        },
        restaurant (parent, args, context, info) {
            return Restaurant.findOne({ _id: args.id })
                .then (restaurant => {
                    return { ...restaurant._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        },
        customers (parent, args, context, info) {
            return Customer.find()
                .then (customer => {
                    return customer.map (r => ({ ...customer._doc }))
                })
                .catch (err => {
                    console.error(err)
                })
        },
        customer (parent, args, context, info) {
            return Customer.findOne({ _id: args.id })
                .then (customer => {
                    return { ...customer._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        },
        orders (parent, args, context, info) {
            return Order.find()
                .then (orderObj => {
                    return orderObj.map (o => ({ ...o._doc }))
                })
                .catch (err => {
                    console.error(err)
                })
        },
        order (parent, args, context, info) {
            return Order.findOne({ _id: args.id })
                .then (orderObj => {
                    return { ...orderObj._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        }
    },
    Mutation: {
        addRestaurant (parent, args, context, info) {
            const { name, email, location, menu } = args
            const restaurantObj = new Restaurant({
                name,
                email,
                location,
                menu
            })
            return restaurantObj.save()
                .then (result => {
                    return { ...result._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        },
        addCustomer (parent, args, context, info) {
            const { name, email, location } = args
            const customerObj = new Customer({
                name,
                email,
                location
            })
            return customerObj.save()
                .then (result => {
                    return { ...result._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        },
        addOrder (parent, args, context, info) {
            const { customerId, restaurantId, order } = args
            const orderObj = new Order({
                customerId,
                restaurantId,
                order
            })
            return orderObj.save()
                .then (result => {
                    return { ...result._doc }
                })
                .catch (err => {
                    console.error(err)
                })
        }
    }
}

module.exports = resolvers
