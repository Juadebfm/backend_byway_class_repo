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

module.exports = validation;