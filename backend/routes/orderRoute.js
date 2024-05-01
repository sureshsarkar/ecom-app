const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthUser, authRoles } = require("../middleware/auth")

router.route("/order/new").post(isAuthUser, newOrder);

router.route("/order/:id").get(isAuthUser, getSingleOrder);

router.route("/orders/me").get(isAuthUser, myOrders);

router.route("/orders/:id").get(isAuthUser, getSingleOrder);

router.route("/admin/orders").get(isAuthUser, authRoles("Admin"), getAllOrders);

router.route("/admin/order/:id").put(isAuthUser, authRoles("Admin"), updateOrder);

router.route("/admin/order/:id").delete(isAuthUser, authRoles("Admin"), deleteOrder);

module.exports = router;
