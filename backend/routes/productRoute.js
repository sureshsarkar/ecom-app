const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthUser, authRoles } = require("../middleware/auth")
const router = express.Router();

// GET All product // GET
router.get("/products", getAllProducts);

// Add new product - Admin // POST
router.post("/admin/product/new", isAuthUser, authRoles("Admin"), createProduct);

// Update product - Admin // PUT
router.put("/admin/product/update/:id", isAuthUser, authRoles("Admin"), updateProduct);

// Delete product - Admin // DELETE
router.delete("/admin/product/delete/:id", isAuthUser, authRoles("Admin"), deleteProduct);

//Add Product review product - // PUT
router.put("/product/review", isAuthUser, createProductReview);

//Get Product Details product - // GET
router.get("/product/getproductdetails/:id", getProductDetails);

//Get product reviews - // GET || Pass product id as query in Header
router.get("/product/reviews", getProductReviews);

//Delete Product reviews - // DELETE
router.delete("/product/reviews", isAuthUser, deleteReview);

module.exports = router;