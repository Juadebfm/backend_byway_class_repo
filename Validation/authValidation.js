const {body,validationResult} = require("express-validator");
const signupValidation = [
    body("username").trim().notEmpty().withMessage("username is required").isAlphanumeric().withMessage("username must be alpha numeric").isLength({min:3,max:20}).withMessage("username must be between 3 and 20 characters"),
    body("firstname").notEmpty().withMessage("firstname is required").isLength({min:3,max:20}).withMessage("firstname must be between 3 and 20 characters"),
    body("lastname").notEmpty().withMessage("lastname is required").isLength({min:3,max:20}).withMessage("lastname must be between 3 and 20 characters"),
    body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("Invalid email adddress"),
    body("password").trim().notEmpty().withMessage("password is required").isLength({min:8}).withMessage("Password must be atleast 8 characters")
];

const loginValidation = [
    body("username").optional().notEmpty().withMessage("username is required"),
    body("email").optional().isEmail().withMessage("Please enter a valid email address"),
    body("password").notEmpty().withMessage("password is required"),
    body("email").custom((value,{req})=>{
        if (!value && !req.body.username) {
            throw new Error("Email or username is required")
        }
        return true;
    })
];
const validation = (req,res,next)=>{
    const Error = validationResult(req);
    if (!Error.isEmpty()) {
        return res.status(400).json({
            success: false,
            Errors: Error.array().map((error)=>error.msg)
        });
    }
    next();
};
module.exports = {loginValidation,signupValidation,validation};