const express = require('express');
let router = express.Router();
const { Product } = require('./controller');
const { auth, isAdmin } = require("../middlewares/auth");
const validation = require('./validation');

router.get('/', Product.index);
router.get('/:productId', Product.show);
router.post('/', auth, isAdmin, validation.create, Product.create);
router.put('/:productId', auth, isAdmin, validation.update, Product.update);
router.delete('/:productId', auth, isAdmin, Product.destroy);
router.post('/:productId/upload', auth, isAdmin, Product.upload);



module.exports = { router };