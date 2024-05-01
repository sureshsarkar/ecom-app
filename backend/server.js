const app = require("./app")
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const error = require("./middleware/error");

// config

dotenv.config({ path: "backend/config/config.env" })


// connect database 
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on the port ${process.env.PORT}`);
})


// Unhandelde Promises Rejected

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shuting down the server due to unhaldeled Rejection`);
    server.close(() => {
        process.exit(1);
    });
});