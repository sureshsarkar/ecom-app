const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require('../utils/errorhandler');

// Create new Order
exports.newOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        const order = await orderModel.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
        });
        console.log(order);
        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 404));
    }
};

// get Single Order By - ADMIN
exports.getSingleOrder = async (req, res, next) => {
    const order = await orderModel.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
};

// get logged in user  Orders
exports.myOrders = async (req, res, next) => {
    const orders = await orderModel.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders,
    });
};

// get all Orders -- Admin
exports.getAllOrders = async (req, res, next) => {
    const orders = await orderModel.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        totalAmount,
        orders,
    });
};

// update Order Status -- Admin
exports.updateOrder = async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};

async function updateStock(id, quantity) {
    const product = await productModel.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await orderModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Order Deleted"
    });
};
