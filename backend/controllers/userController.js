const User = require("../models/userModel");
const ErrorHandler = require('../utils/errorhandler');
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
// Register a User*******************************************
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existEmail = await User.findOne({ email })

        if (existEmail) {
            return next(new ErrorHandler(`This email already exits `, 404))
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "dfdfdf",
                url: "dfgdfgdfgfb vbnvb"
            },
        });
        // function to send response - created in | ../utils/jwtToken
        sendToken(user, 200, res);

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }
};


// Login a User*******************************************
exports.loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        // if user have given email and password
        if (!email || !password) {
            return next(new ErrorHandler(`Please enter email & password`, 400))
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler(`Invalid email or password`, 401))
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler(`Invalid password`, 401))
        }

        // function to send response - created in | ../utils/jwtToken
        sendToken(user, 200, res);

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }
};

// Logout a User*******************************************
exports.logoutUser = async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });


};


// Forgot Password******************************************
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Get ResetPassword Token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get(
            "host"
        )}/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

        try {
            const resData = await sendEmail({
                email: user.email,
                subject: `Ecommerce Password Recovery`,
                message,
            });
            console.log(resData);
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(error.message, 500));
        }

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }
};



// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        // creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(
                new ErrorHandler(
                    "Reset Password Token is invalid or has been expired",
                    400
                )
            );
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not match", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }

};


// Get User Detail
exports.getUserDetailsByUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler(`User not found`, 404))
        }
        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }

};

// Get All User (Admin)
exports.getAllUser = async (req, res, next) => {
    try {

        const users = await User.find();

        if (!users) {
            return next(new ErrorHandler(`User not found`, 404))
        }
        res.status(200).json({
            count: users.length,
            success: true,
            users: users
        });

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }

};

// Get single user (admin)
exports.getSingleUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
            );
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

    }
};


// update User password
exports.updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler("password does not match", 400));
        }

        user.password = newPassword;

        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }

};


// Update user Profile*******************************************
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const newUserData = {
            name,
            email,
            avatar: {
                public_id: "dfdfdf",
                url: "dfgdfgdfgfb vbnvb"
            },
        };

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        sendToken(user, 200, res);

    }
    catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }

};


// Update User Role -- Admin
exports.updateUserRole = async (req, res, next) => {
    try {


        const { role } = req.body;
        const newUserData = { role: role };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))

    }
};


// Delete User --Admin
exports.deleteUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
            );
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        });

    } catch (error) {
        return next(new ErrorHandler(`${error}`, 404))
    }
};
