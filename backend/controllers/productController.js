const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const ApiFeatures = require('../utils/ApiFeatures');


// create product - Admin
exports.createProduct = async (req, res, next) => {
    req.body.user = req.user.id;
    const productData = await productModel.create(req.body)
    try {
        return res.status(200).send({
            success: true,
            message: `Product added successfully`,
            productData
        })
    } catch (error) {
        return next(new ErrorHandler(`Product not Added ${error}`, 404))
    }
}

// update product -- Admin
exports.updateProduct = async (req, res, next) => {
    let Data = await productModel.findById(req.params.id)

    try {
        if (!Data) {
            return next(new ErrorHandler("Product not found", 404))
        }
        Data = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
                useFindAdnModify: false
            }
        )
        return res.status(200).send({
            success: true,
            message: `Product updated successfully`,
            blogCount: Data.length,
            product: Data
        })

    } catch (error) {
        return next(new ErrorHandler(`Server Error: ${error}`, 404))
    }

}

// delete product -- Admin 
exports.deleteProduct = async (req, res, next) => {
    try {
        let Data = await productModel.findById(req.params.id)
        if (!Data) {
            return next(new ErrorHandler("Product not found", 404))
        }
        Data = await productModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: `Product Deleted successfully`,
            product: Data
        })
    } catch (error) {
        return next(new ErrorHandler(`Product not found ${error}`, 404))
    }
}


// get product details 
exports.getProductDetails = async (req, res, next) => {
    try {
        let productData = await productModel.findById(req.params.id)
        if (!productData) {
            return next(new ErrorHandler(`Product not found ${error}`, 404))
        }
        return res.status(200).send({
            success: true,
            message: "Product found",
            data: productData
        })
    } catch (error) {
        return next(new ErrorHandler(`Internal Server Error ${error}`, 404))
    }
}


// get all products 
exports.getAllProducts = async (req, res, next) => {
    try {
        const resultPerPage = 5;
        const apiFeature = new ApiFeatures(productModel.find(), req.query)
            .search()
            .filter().pagination(resultPerPage);
        const getProduct = await apiFeature.query;
        const productCount = getProduct.length;
        return res.status(200).send({
            success: true,
            message: `Product Found`,
            count: productCount,
            getProduct
        })
    } catch (error) {
        return next(new ErrorHandler(`Internal Server Error ${error}`, 404))
    }
}

// Create New Review or Update the review
exports.createProductReview = async (req, res, next) => {
    try {

        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await productModel.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });

    } catch (error) {
        return next(new ErrorHandler(`Internal Server Error ${error}`, 404))

    }
};

// Get All Reviews of a product
exports.getProductReviews = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.query.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    } catch (error) {
        return next(new ErrorHandler(`Internal Server Error ${error}`, 404))
    }
};



// Delete Review
exports.deleteReview = async (req, res, next) => {
    const product = await productModel.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await productModel.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
};
