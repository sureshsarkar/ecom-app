const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'name is required'],
        trim: true
    },
    description: {
        type: String,
        require: [true, 'description is required']
    },

    price: {
        type: String,
        require: [true, 'price is required'],
        maxLength: [8, 'Price can not exceed 8 charactores']
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: [
        {
            public_id: {
                type: String,
                require: [true, 'image is required']
            },
            url: {
                type: String,
                require: true
            }
        }
    ],
    category: {
        type: String,
        require: [true, 'Please enter category']
    },
    stock: {
        type: Number,
        require: [true, 'Please enter stock'],
        maxLength: [4, 'Stock can not greater than 4'],
        default: 1

    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                require: true
            },
            rating: {
                type: Number,
                require: true
            },
            comment: {
                type: String,
                require: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}
)

module.exports = mongoose.model('product', productSchema)

// module.exports = productModel;