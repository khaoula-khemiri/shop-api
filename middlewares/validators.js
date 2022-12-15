const { check, validationResult } = require("express-validator");

exports.userValidator = [
    check("username").trim().notEmpty().withMessage("username is missing"),
    check("email").normalizeEmail().isEmail().withMessage("email is not valide"),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("password is missing")
        .isLength({ min: 3 })
        .withMessage("password must be 3 characters min"),
];

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        res.status(400).json(error[0].msg)

    } else {
        next();
    }

};