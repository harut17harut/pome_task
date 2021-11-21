const { body } = require('express-validator');
const create = [
    body('title')
        .notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body('price')
        .notEmpty().withMessage('Field is required')
        .isNumeric().withMessage('This value must be numeric')

];
const update = [
    body('title')
        .notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body('price')
        .notEmpty().withMessage('Field is required')
        .isNumeric().withMessage('This value must be numeric')
];
module.exports = {
    create,
    update
}