const mongoose = require('mongoose')
const { Schema } = mongoose

const MenuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    menu: {
        type: [MenuSchema]
    }
})

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

const OrderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    order: {
        type: [Schema.Types.ObjectId],
        ref: 'Order',
        order: true
    }
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)
const Customer = mongoose.model('Customer', CustomerSchema)
const Order = mongoose.model('Order', OrderSchema)

module.exports = {
    Restaurant,
    Customer,
    Order
}
