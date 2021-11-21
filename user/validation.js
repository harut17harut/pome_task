const { body } = require('express-validator');
const { UserService } = require('./service');

const create = [
    body('name')
        .notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body("email").isEmail().withMessage("This field is for email").custom(async (value) => {
        let data = await UserService.getByEmail(value);
        if (data && data.hasOwnProperty("id")) {
            return Promise.reject('Email is busy');
        }
        return true;
    }),
    body('password')
        .notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character')

];
const update = [
    body('name').notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body('gender').isEmpty().isIn(['male', 'female', '']),
    body('dob').notEmpty().isDate()
];
const signin = [
    body('email').notEmpty().withMessage("Username Field is required"),
    body("password").notEmpty().withMessage("Password field is required"),
    body("email").custom(async (value) => {
        let data = await UserService.getActiveUser(value);
        if (data && data.hasOwnProperty("id")) {
            return true;
        }
        return Promise.reject('User not found or is not active');
    })
]
module.exports = {
    create,
    update,
    signin
}