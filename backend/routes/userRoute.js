const express = require("express");
const {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetailsByUser, getAllUser, updateUser, updatePassword, getSingleUserByAdmin, updateUserRole, deleteUser
} = require("../controllers/userController");
const { isAuthUser, authRoles } = require("../middleware/auth")


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthUser, getUserDetailsByUser);
router.route("/admin/getallusers").get(isAuthUser, authRoles("Admin"), getAllUser);
router.route("/admin/getsingleuser/:id").get(isAuthUser, authRoles("Admin"), getSingleUserByAdmin);
router.route("/admin/updateroleuser/:id").put(isAuthUser, authRoles("Admin"), updateUserRole);
router.route("/admin/deleteuser/:id").delete(isAuthUser, authRoles("Admin"), deleteUser);
router.route("/updatepassword").put(isAuthUser, updatePassword);
router.route("/updateuserprofile").put(isAuthUser, updateUser);

module.exports = router;
