const user = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const signup = async function(req, res) {
    try {
        const {
            username,
            firstname,
            lastname,
            email,
            password
        } = req.body;
        if (!username || !firstname || !lastname || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all field"
            });
        }
        const existingUser = await user.findOne({
            $or: [{
                email
            }, {
                username
            }],
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    message: "Email already exist"
                });
            } else {
                return res.status(409).json({
                    message: "Username already exist"
                });
            }
        }
        const newUser = new user({
            username,
            firstname,
            lastname,
            email,
            password,
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                Id: newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            message: "Error signing up user"
        });
    }
};
const login = async function(req, res) {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        if ((!email || !username) && !password) {
            return res.status(400).json({
                message: "Please fill in all field"
            });
        }
        const existingUser = await user.findOne({
            $or: [{
                email
            }, {
                username
            }],
        });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid username or email"
            });
        }
        const isCorrectPassword = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isCorrectPassword) {
            return res.status(401).json({
                message: "Incorrect pasword"
            });
        }
        const token = jwt.sign({
                userId: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
            },
            process.env.JWSECRET, {
                expiresIn: "1d"
            } // Expires in 1 day
        );
        res.status(201).json({
            message: "User log in successfully",
            token,
            user: {
                Id: existingUser._id,
                username: existingUser.username,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                email: existingUser.email,
            },
        });
    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            message: "Error login user"
        });
    }
};
module.exports = {
    signup,
    login
};