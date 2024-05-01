const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log(`Connected to mongoDB successfully ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connecting Error ${error}`);
    }
}

module.exports = connectDB;